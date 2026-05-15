import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";

const COUPON_CODE = process.env.COUPON_CODE || "ben28gur28waves28";
const TRIAL_COUPON_CODE = process.env.TRIAL_COUPON_CODE || "KillerIceCream100";

export async function POST(request: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: "Payment system not configured" }, { status: 500 });
    }

    // Verify auth
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }
    const authSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    const { data: { user } } = await authSupabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, coupon } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Block if already Pro (active or trial)
    const { data: existingSub } = await supabaseAdmin
      .from("subscriptions")
      .select("plan, status, expires_at")
      .eq("user_id", user.id)
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const hasActivePro = existingSub?.plan === "pro" &&
      (existingSub.status === "active" || existingSub.status === "pending_cancellation");

    if (hasActivePro) {
      const isTrial = !!existingSub.expires_at;
      const isPaying = !coupon || (coupon.toLowerCase() !== COUPON_CODE.toLowerCase() && coupon.toLowerCase() !== TRIAL_COUPON_CODE.toLowerCase());
      // Only allow trial users to proceed to Stripe checkout; block everything else
      if (!isTrial || !isPaying) {
        return NextResponse.json({ error: "You already have an active Pro subscription." }, { status: 400 });
      }
    }

    const isCouponValid = coupon && coupon.toLowerCase() === COUPON_CODE.toLowerCase();
    const isTrialCoupon = coupon && coupon.toLowerCase() === TRIAL_COUPON_CODE.toLowerCase();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://glyph.calyvent.com";

    if (isTrialCoupon) {
      // 6-month free trial
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

      await supabaseAdmin.from("subscriptions").upsert(
        {
          user_id: user.id,
          plan: "pro",
          payment_method: "trial",
          payment_reference: coupon,
          status: "active",
          started_at: new Date().toISOString(),
          expires_at: sixMonthsFromNow.toISOString(),
        },
        { onConflict: "user_id" }
      );

      return NextResponse.json({ trial: true, expires_at: sixMonthsFromNow.toISOString() });
    }

    if (isCouponValid) {
      // Store permanent coupon activation by email
      await supabaseAdmin.from("coupon_activations").upsert(
        { email: email.toLowerCase(), coupon_code: coupon },
        { onConflict: "email" }
      );

      await supabaseAdmin.from("subscriptions").upsert(
        {
          user_id: user.id,
          plan: "pro",
          payment_method: "coupon",
          payment_reference: coupon,
          status: "active",
          expires_at: null,
        },
        { onConflict: "user_id" }
      );

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
