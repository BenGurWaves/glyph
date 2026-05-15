import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendEmail, buildCancellationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
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

    // Find active Stripe subscription
    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("payment_reference, status, payment_method")
      .eq("user_id", user.id)
      .eq("status", "active")
      .eq("payment_method", "stripe")
      .single();

    if (!sub || !sub.payment_reference) {
      return NextResponse.json({ error: "No active Stripe subscription found" }, { status: 400 });
    }

    // Cancel via Stripe API
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: "Payment system not configured" }, { status: 500 });
    }

    const stripeSubId = sub.payment_reference;
    const res = await fetch(`https://api.stripe.com/v1/subscriptions/${stripeSubId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "cancel_at_period_end=true",
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("[Cancel] Stripe error:", result.error?.message);
      return NextResponse.json({ error: result.error?.message || "Stripe error" }, { status: 500 });
    }

    // Mark as pending_cancellation so the UI knows the user initiated cancellation.
    // Stripe keeps the subscription active until the billing period ends.
    // The webhook "customer.subscription.deleted" will fire then and update
    // the status to "cancelled". The "customer.subscription.updated" webhook
    // also syncs cancel_at_period_end to pending_cancellation as a backup.
    await supabaseAdmin
      .from("subscriptions")
      .update({ status: "pending_cancellation" })
      .eq("user_id", user.id)
      .eq("payment_method", "stripe");

    // Send cancellation email
    const endDate = result.current_period_end
      ? new Date(result.current_period_end * 1000).toLocaleDateString("en-US", {
          year: "numeric", month: "long", day: "numeric",
        })
      : "the end of your billing period";
    try {
      if (user.email) {
        await sendEmail(buildCancellationEmail(user.email, endDate));
      }
    } catch (emailErr) {
      console.error("[Cancel] email error:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Cancel failed";
    console.error("[Cancel] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
