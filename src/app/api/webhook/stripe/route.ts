import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Look up user by email
      const { data: userData } = await supabase.rpc("get_user_id_by_email", {
        user_email: email.toLowerCase(),
      });

      if (userData && userData.length > 0) {
        const userId = userData[0].id;

        // Create or update subscription
        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            plan: "pro",
            payment_method: "stripe",
            payment_reference: session.subscription || session.id,
            status: "active",
          },
          { onConflict: "user_id" }
        );
      } else {
        // User hasn't signed up yet — store as coupon activation
        // so they get Pro when they do sign up
        await supabase.from("coupon_activations").upsert(
          { email: email.toLowerCase(), coupon_code: `stripe:${session.id}` },
          { onConflict: "email" }
        );
      }
    }

    // Handle customer.subscription.deleted (cancellation)
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      await supabase
        .from("subscriptions")
        .update({ status: "cancelled" })
        .eq("payment_reference", subscription.id);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
