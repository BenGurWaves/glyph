import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  try {
    // Verify auth
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // Get subscription from Supabase (admin bypasses RLS)
    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("plan, status, payment_method, payment_reference, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Check coupon activations as fallback for Pro status
    const { data: coupon } = await supabaseAdmin
      .from("coupon_activations")
      .select("email, coupon_code, created_at")
      .eq("email", user.email?.toLowerCase() || "")
      .maybeSingle();

    // Build response
    const response: {
      plan: string;
      status: string;
      payment_method: string;
      is_pro: boolean;
      amount?: string;
      interval?: string;
      next_billing_date?: string;
      start_date?: string;
      payment_reference?: string;
      card_brand?: string;
      card_last4?: string;
    } = {
      plan: sub?.plan || "free",
      status: sub?.status || "inactive",
      payment_method: sub?.payment_method || "none",
      is_pro: (sub?.plan === "pro" && sub?.status === "active") || !!coupon,
    };

    // Enrich Stripe subscription with API details
    if (sub?.payment_method === "stripe" && sub?.payment_reference) {
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (stripeKey) {
        try {
          // Get subscription details
          const subRes = await fetch(
            `https://api.stripe.com/v1/subscriptions/${sub.payment_reference}`,
            { headers: { Authorization: `Bearer ${stripeKey}` } }
          );
          const subData = await subRes.json();

          if (subRes.ok) {
            response.amount = "$3";
            response.interval = "month";
            response.next_billing_date = subData.current_period_end
              ? new Date(subData.current_period_end * 1000).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : undefined;
            response.start_date = subData.current_period_start
              ? new Date(subData.current_period_start * 1000).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : undefined;

            // Get default payment method details
            if (subData.default_payment_method) {
              const pmRes = await fetch(
                `https://api.stripe.com/v1/payment_methods/${subData.default_payment_method}`,
                { headers: { Authorization: `Bearer ${stripeKey}` } }
              );
              const pmData = await pmRes.json();
              if (pmRes.ok && pmData.card) {
                response.card_brand = pmData.card.brand;
                response.card_last4 = pmData.card.last4;
              }
            }
          }
        } catch (stripeErr) {
          console.error("[Subscription] Stripe enrichment error:", stripeErr);
        }
      }
    }

    // Fallback for coupon/crypto pro status
    if (!sub && coupon) {
      response.plan = "pro";
      response.status = "active";
      response.payment_method = "coupon";
      response.is_pro = true;
      response.amount = "$3";
      response.interval = "month";
    }

    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Subscription fetch failed";
    console.error("[Subscription] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
