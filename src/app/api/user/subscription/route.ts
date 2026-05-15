import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendEmail, buildPaymentDueEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
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

    // Get subscription (admin bypasses RLS)
    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("plan, status, payment_method, payment_reference, started_at, expires_at, reminder_sent_at")
      .eq("user_id", user.id)
      .order("started_at", { ascending: false })
      .limit(1)
      .single();

    // Check coupon activations as fallback
    const { data: coupon } = await supabaseAdmin
      .from("coupon_activations")
      .select("email, coupon_code, created_at")
      .eq("email", user.email?.toLowerCase() || "")
      .maybeSingle();

    const now = new Date();
    let isPro = false;
    let isTrial = false;
    let isExpired = false;
    let showWarning = false;
    let daysUntilExpiry: number | null = null;
    let expiresAt: string | null = null;

    // Trial expiration check & auto-downgrade
    if (sub?.plan === "pro" && sub?.status === "active") {
      if (sub.expires_at) {
        const expiry = new Date(sub.expires_at);
        expiresAt = sub.expires_at;
        daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (expiry < now) {
          // Trial expired — downgrade to free
          isExpired = true;
          await supabaseAdmin
            .from("subscriptions")
            .update({ plan: "free", status: "expired", expires_at: null })
            .eq("user_id", user.id);
        } else {
          isPro = true;
          isTrial = sub.payment_method === "trial";
          // Show warning 7 days before expiry
          const warningDate = new Date(expiry.getTime() - 7 * 24 * 60 * 60 * 1000);
          showWarning = now >= warningDate;

          // Send payment due email once per day during warning period
          if (showWarning && isTrial && user.email) {
            const lastSent = sub.reminder_sent_at ? new Date(sub.reminder_sent_at) : null;
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            if (!lastSent || lastSent < oneDayAgo) {
              try {
                await sendEmail(buildPaymentDueEmail(
                  user.email,
                  daysUntilExpiry,
                  expiry.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                ));
                await supabaseAdmin
                  .from("subscriptions")
                  .update({ reminder_sent_at: now.toISOString() })
                  .eq("user_id", user.id);
              } catch (emailErr) {
                console.error("[Subscription] reminder email error:", emailErr);
              }
            }
          }
        }
      } else {
        // No expiry = paid subscription or permanent coupon
        isPro = true;
        isTrial = false;
      }
    }

    // Fallback: coupon activation gives permanent Pro
    if (!isPro && coupon) {
      isPro = true;
    }

    const response: {
      plan: string;
      status: string;
      payment_method: string;
      is_pro: boolean;
      is_trial: boolean;
      is_expired: boolean;
      show_warning: boolean;
      days_until_expiry: number | null;
      expires_at: string | null;
      amount?: string;
      interval?: string;
      next_billing_date?: string;
      start_date?: string;
      card_brand?: string;
      card_last4?: string;
    } = {
      plan: isExpired ? "free" : (sub?.plan || "free"),
      status: isExpired ? "expired" : (sub?.status || "inactive"),
      payment_method: sub?.payment_method || "none",
      is_pro: isPro,
      is_trial: isTrial,
      is_expired: isExpired,
      show_warning: showWarning,
      days_until_expiry: daysUntilExpiry,
      expires_at: expiresAt,
    };

    // Enrich Stripe subscription with API details
    if (sub?.payment_method === "stripe" && sub?.payment_reference && !isExpired) {
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (stripeKey) {
        try {
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
                  year: "numeric", month: "long", day: "numeric",
                })
              : undefined;
            response.start_date = subData.current_period_start
              ? new Date(subData.current_period_start * 1000).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })
              : undefined;

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

    // Fallback for coupon/crypto
    if (!sub && coupon) {
      response.plan = "pro";
      response.status = "active";
      response.payment_method = "coupon";
      response.is_pro = true;
      response.amount = "$3";
      response.interval = "month";
    }

    // Trial fallback amounts
    if (isTrial && !response.amount) {
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
