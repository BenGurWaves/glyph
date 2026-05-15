import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendEmail, buildProWelcomeEmail } from "@/lib/email";

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

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("x-cc-webhook-signature");
    const secret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;
    if (!secret) {
      console.error("[Coinbase webhook] COINBASE_COMMERCE_WEBHOOK_SECRET not set");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }
    if (!signature) {
      console.error("[Coinbase webhook] Missing signature");
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }
    const expected = await hmacSha256(secret, payload);
    if (signature !== expected) {
      console.error("[Coinbase webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(payload);
    const event = body.event;

    if (!event) {
      return NextResponse.json({ received: true });
    }

    // Only process confirmed payments
    if (
      event.type !== "charge:confirmed" &&
      event.type !== "charge:resolved"
    ) {
      return NextResponse.json({ received: true });
    }

    const email = event.data?.metadata?.email;
    if (!email) {
      return NextResponse.json({ received: true });
    }

    // Look up user by email
    const { data: userData, error: userError } = await supabaseAdmin.rpc("get_user_id_by_email", {
      user_email: email.toLowerCase(),
    });

    if (userError) {
      console.error("[Coinbase webhook] get_user_id_by_email error:", userError.message);
    }

    if (userData && userData.length > 0) {
      const userId = userData[0].id;

      // Activate Pro subscription (clear expires_at to convert trial→paid)
      const { error: subError } = await supabaseAdmin.from("subscriptions").upsert(
        {
          user_id: userId,
          plan: "pro",
          payment_method: "crypto",
          payment_reference: `coinbase:${event.data.code}`,
          status: "active",
          expires_at: null,
        },
        { onConflict: "user_id" }
      );

      if (subError) {
        console.error("[Coinbase webhook] subscription upsert error:", subError.message);
        // Fallback: store as coupon activation so payment isn't lost
        await supabaseAdmin.from("coupon_activations").upsert(
          { email: email.toLowerCase(), coupon_code: `coinbase:${event.data.code}` },
          { onConflict: "email" }
        );
      } else {
        // Send welcome email for crypto payments
        try {
          await sendEmail(buildProWelcomeEmail(email));
        } catch (emailErr) {
          console.error("[Coinbase webhook] email error:", emailErr);
        }
      }
    } else {
      // User hasn't signed up yet — store activation for when they do
      await supabaseAdmin.from("coupon_activations").upsert(
        {
          email: email.toLowerCase(),
          coupon_code: `coinbase:${event.data.code}`,
        },
        { onConflict: "email" }
      );
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    console.error("[Coinbase webhook] unhandled error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
