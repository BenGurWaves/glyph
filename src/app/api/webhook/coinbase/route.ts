import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

      // Activate Pro subscription
      await supabase.from("subscriptions").upsert(
        {
          user_id: userId,
          plan: "pro",
          payment_method: "crypto",
          payment_reference: `coinbase:${event.data.code}`,
          status: "active",
        },
        { onConflict: "user_id" }
      );
    } else {
      // User hasn't signed up yet — store activation for when they do
      await supabase.from("coupon_activations").upsert(
        {
          email: email.toLowerCase(),
          coupon_code: `coinbase:${event.data.code}`,
        },
        { onConflict: "email" }
      );
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
