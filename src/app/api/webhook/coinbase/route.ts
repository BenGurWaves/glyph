import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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

      // Activate Pro subscription
      const { error: subError } = await supabaseAdmin.from("subscriptions").upsert(
        {
          user_id: userId,
          plan: "pro",
          payment_method: "crypto",
          payment_reference: `coinbase:${event.data.code}`,
          status: "active",
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
