import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const COUPON_CODE = process.env.COUPON_CODE || "bengurwaves28";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, coupon } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Check coupon — if valid, make it free (100% off)
  const isCouponValid = coupon && coupon.toLowerCase() === COUPON_CODE.toLowerCase();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://glyph.calyvent.com";

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer_email: email,
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Glyph Pro",
            description: "Unlimited dynamic QR codes, scan analytics, custom styling, bulk generation, API access",
          },
          unit_amount: isCouponValid ? 0 : 300, // $3.00 or $0
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    metadata: {
      coupon_used: isCouponValid ? coupon : "",
    },
  };

  // If coupon makes it free, allow trial-like behavior
  if (isCouponValid) {
    sessionParams.payment_method_collection = "if_required";
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  return NextResponse.json({ url: session.url });
}
