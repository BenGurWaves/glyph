import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Crypto payments not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://glyph.calyvent.com";

    // Create a Coinbase Commerce charge
    const res = await fetch("https://api.commerce.coinbase.com/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": apiKey,
        "X-CC-Version": "2018-03-22",
      },
      body: JSON.stringify({
        name: "Glyph Pro",
        description:
          "Unlimited dynamic QR codes, scan analytics, custom styling, bulk generation, API access",
        pricing_type: "fixed_price",
        local_price: {
          amount: "3.00",
          currency: "USD",
        },
        metadata: {
          email: email.toLowerCase(),
        },
        redirect_url: `${appUrl}/dashboard?checkout=success&method=crypto`,
        cancel_url: `${appUrl}/pricing?checkout=cancelled`,
      }),
    });

    const charge = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: charge.error?.message || "Coinbase Commerce error" },
        { status: res.status }
      );
    }

    return NextResponse.json({ url: charge.data.hosted_url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Crypto checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
