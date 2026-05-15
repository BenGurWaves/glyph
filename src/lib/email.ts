type EmailPayload = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY not set. Skipping email.");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Glyph <noreply@glyph.calyvent.com>",
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error("[Email] Resend error:", data);
  }
}

export function buildProWelcomeEmail(email: string): EmailPayload {
  const text = `Welcome to Glyph Pro.

Your Pro subscription is now active. You have unlimited dynamic QR codes, full scan analytics, custom styling, bulk generation, and API access.

Manage your account: https://glyph.calyvent.com/dashboard/settings

— Glyph`;

  const html = `<p>Welcome to <strong>Glyph Pro</strong>.</p>
<p>Your Pro subscription is now active. You have unlimited dynamic QR codes, full scan analytics, custom styling, bulk generation, and API access.</p>
<p><a href="https://glyph.calyvent.com/dashboard/settings">Manage your account</a></p>
<p>— Glyph</p>`;

  return { to: email, subject: "Welcome to Glyph Pro", text, html };
}

export function buildReceiptEmail(email: string, amount: string, date: string): EmailPayload {
  const text = `Glyph Pro — Receipt

Amount: ${amount}
Date: ${date}
Plan: Pro (monthly)

Thank you for your payment.

— Glyph`;

  const html = `<p><strong>Glyph Pro — Receipt</strong></p>
<p>Amount: ${amount}</p>
<p>Date: ${date}</p>
<p>Plan: Pro (monthly)</p>
<p>Thank you for your payment.</p>
<p>— Glyph</p>`;

  return { to: email, subject: "Glyph Pro Receipt", text, html };
}

export function buildCancellationEmail(email: string, endDate: string): EmailPayload {
  const text = `Glyph Pro — Subscription Cancelled

Your subscription has been cancelled. You will retain Pro access until ${endDate}.

After that, your account will revert to the free plan. All your QR codes and data will remain saved.

If you change your mind, you can resubscribe anytime: https://glyph.calyvent.com/pricing

— Glyph`;

  const html = `<p><strong>Glyph Pro — Subscription Cancelled</strong></p>
<p>Your subscription has been cancelled. You will retain Pro access until <strong>${endDate}</strong>.</p>
<p>After that, your account will revert to the free plan. All your QR codes and data will remain saved.</p>
<p><a href="https://glyph.calyvent.com/pricing">Resubscribe anytime</a></p>
<p>— Glyph</p>`;

  return { to: email, subject: "Glyph Pro — Subscription Cancelled", text, html };
}

export function buildPaymentDueEmail(email: string, daysLeft: number, expiryDate: string): EmailPayload {
  const text = `Glyph Pro — Payment Due Soon

Your Pro trial expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""} (${expiryDate}).

Add a payment method now to keep your Pro features uninterrupted.

https://glyph.calyvent.com/pricing

— Glyph`;

  const html = `<p><strong>Glyph Pro — Payment Due Soon</strong></p>
<p>Your Pro trial expires in <strong>${daysLeft} day${daysLeft !== 1 ? "s" : ""}</strong> (${expiryDate}).</p>
<p>Add a payment method now to keep your Pro features uninterrupted.</p>
<p><a href="https://glyph.calyvent.com/pricing">Add payment method</a></p>
<p>— Glyph</p>`;

  return { to: email, subject: "Glyph Pro — Payment Due Soon", text, html };
}
