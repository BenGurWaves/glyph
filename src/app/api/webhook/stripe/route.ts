import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const event = JSON.parse(body);

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

        // Create or update subscription
        const { error: subError } = await supabaseAdmin.from("subscriptions").upsert(
          {
            user_id: userId,
            plan: "pro",
            payment_method: "stripe",
            payment_reference: session.subscription || session.id,
            status: "active",
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

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    console.error("[Stripe webhook] unhandled error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
