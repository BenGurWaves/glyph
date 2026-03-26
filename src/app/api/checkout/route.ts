import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const COUPON_CODE = process.env.COUPON_CODE || "ben28gur28waves28";

export async function POST(request: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: "Payment system not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { email, coupon } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const isCouponValid = coupon && coupon.toLowerCase() === COUPON_CODE.toLowerCase();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://glyph.calyvent.com";

    if (isCouponValid) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Store coupon activation by email
      await supabase.from("coupon_activations").upsert(
        { email: email.toLowerCase(), coupon_code: coupon },
        { onConflict: "email" }
      );

      // If user already exists, activate Pro subscription directly
      const { data: userData } = await supabase.rpc("get_user_id_by_email", {
        user_email: email.toLowerCase(),
      });

      if (userData && userData.length > 0) {
        const userId = userData[0].id;
        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            plan: "pro",
            payment_method: "coupon",
            payment_reference: coupon,
            status: "active",
          },
          { onConflict: "user_id" }
        );
      }

      return NextResponse.json({ free: true });
    }

    // Normal Stripe checkout
    const params = new URLSearchParams();
    params.append("customer_email", email);
    params.append("mode", "subscription");
    params.append("payment_method_types[0]", "card");
    params.append("payment_method_types[1]", "cashapp");
    params.append("line_items[0][price_data][currency]", "usd");
    params.append("line_items[0][price_data][product_data][name]", "Glyph Pro");
    params.append("line_items[0][price_data][product_data][description]", "Unlimited dynamic QR codes, scan analytics, custom styling, bulk generation, API access");
    params.append("line_items[0][price_data][unit_amount]", "300");
    params.append("line_items[0][price_data][recurring][interval]", "month");
    params.append("line_items[0][quantity]", "1");
    params.append("success_url", `${appUrl}/dashboard?checkout=success`);
    params.append("cancel_url", `${appUrl}/pricing?checkout=cancelled`);

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const session = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: session.error?.message || "Stripe error" },
        { status: res.status }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
