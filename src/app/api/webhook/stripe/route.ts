import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendEmail, buildProWelcomeEmail, buildReceiptEmail } from "@/lib/email";

async function hmacSha256(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function verifyStripeSignature(payload: string, signature: string, secret: string): Promise<boolean> {
  const elements = signature.split(",");
  let timestamp = "";
  const sigs = new Map<string, string>();
  for (const element of elements) {
    const [key, value] = element.trim().split("=");
    if (key === "t") timestamp = value;
    else if (key) sigs.set(key, value);
  }
  const expected = await hmacSha256(secret, `${timestamp}.${payload}`);
  return sigs.get("v1") === expected;
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("stripe-signature");
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      console.error("[Stripe webhook] STRIPE_WEBHOOK_SECRET not set");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }
    if (!signature || !(await verifyStripeSignature(payload, signature, secret))) {
      console.error("[Stripe webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(payload);

    // Handle checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const email = session.customer_email;

      if (!email) {
        return NextResponse.json({ received: true });
      }

      // Look up user by email
      const { data: userData, error: userError } = await supabaseAdmin.rpc("get_user_id_by_email", {
        user_email: email.toLowerCase(),
      });

      if (userError) {
        console.error("[Stripe webhook] get_user_id_by_email error:", userError.message);
      }

      if (userData && userData.length > 0) {
        const userId = userData[0].id;

        // Create or update subscription (clears expires_at for trial→paid conversion)
        const { error: subError } = await supabaseAdmin.from("subscriptions").upsert(
          {
            user_id: userId,
            plan: "pro",
            payment_method: "stripe",
            payment_reference: session.subscription || session.id,
            status: "active",
            expires_at: null,
          },
          { onConflict: "user_id" }
        );

        if (subError) {
          console.error("[Stripe webhook] subscription upsert error:", subError.message);
          // Fallback: store as coupon activation so payment isn't lost
          await supabaseAdmin.from("coupon_activations").upsert(
            { email: email.toLowerCase(), coupon_code: `stripe:${session.id}` },
            { onConflict: "email" }
          );
        } else {
          // Send welcome + receipt email
          const now = new Date().toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric",
          });
          try {
            await sendEmail(buildProWelcomeEmail(email));
            await sendEmail(buildReceiptEmail(email, "$3.00", now));
          } catch (emailErr) {
            console.error("[Stripe webhook] email error:", emailErr);
          }
        }
      } else {
        // User hasn't signed up yet — store as coupon activation
        // so they get Pro when they do sign up
        await supabaseAdmin.from("coupon_activations").upsert(
          { email: email.toLowerCase(), coupon_code: `stripe:${session.id}` },
          { onConflict: "email" }
        );
      }
    }

    // Handle customer.subscription.deleted (cancellation)
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;

      const { error: cancelError } = await supabaseAdmin
        .from("subscriptions")
        .update({ status: "cancelled" })
        .eq("payment_reference", subscription.id);

      if (cancelError) {
        console.error("[Stripe webhook] cancellation error:", cancelError.message);
      }
    }

    // Handle customer.subscription.updated (track pending cancellation)
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      if (subscription.cancel_at_period_end) {
        await supabaseAdmin
          .from("subscriptions")
          .update({ status: "pending_cancellation" })
          .eq("payment_reference", subscription.id)
          .eq("status", "active");
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    console.error("[Stripe webhook] unhandled error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
