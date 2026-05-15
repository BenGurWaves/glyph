# Glyph

Dynamic QR code generator with scan analytics, custom styling, bulk generation, and API access.

Built with Next.js, Supabase, Stripe, and deployed on Cloudflare Workers.

## Development

```bash
npm run dev
```

## Environment Variables

| Variable | Description | Where |
|----------|-------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `.env.local`, Cloudflare secrets |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key | `.env.local`, Cloudflare secrets |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase **service role** key (server-side only) | `.env.local`, Cloudflare secrets |
| `STRIPE_SECRET_KEY` | Stripe API key | `.env.local`, Cloudflare secrets |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `.env.local`, Cloudflare secrets |
| `COINBASE_COMMERCE_API_KEY` | Coinbase Commerce API key | `.env.local`, Cloudflare secrets |
| `NEXT_PUBLIC_APP_URL` | Your app URL (`https://glyph.calyvent.com`) | `.env.local` |
| `COUPON_CODE` | Free Pro coupon code | `.env.local`, Cloudflare secrets |
| `TRIAL_COUPON_CODE` | 6-month trial coupon (default: `KillerIceCream100`) | `.env.local`, Cloudflare secrets |
| `RESEND_API_KEY` | Resend API key for payment emails | `.env.local`, Cloudflare secrets |

**Important:** `SUPABASE_SERVICE_ROLE_KEY` is required for all server-side API routes to bypass Row Level Security (RLS) on `subscriptions`, `qr_codes`, `scans`, `api_keys`, and `coupon_activations`.

## Deploy

### Production

```bash
npm run deploy
```

### Preview (does not affect production)

```bash
# Temporarily rename worker for preview
sed -i '' 's/"name": "glyph"/"name": "glyph-preview"/' wrangler.jsonc
npm run deploy
sed -i '' 's/"name": "glyph-preview"/"name": "glyph"/' wrangler.jsonc
```

## Features

- **Static & Dynamic QR Codes** — Dynamic codes can change destination URLs after printing
- **Scan Analytics** — Track device, browser, location, and referrer for every scan
- **Custom Styling** — Pro users can customize colors and add logos
- **Bulk Generation** — Generate up to 100 QR codes at once
- **API Access** — Create and manage QR codes programmatically
- **Payment** — Stripe subscriptions + Coinbase Commerce for crypto
- **Account Management** — Cancel subscription, sign out, delete account

## Database Schema

Key tables:

- `qr_codes` — QR code records (static/dynamic)
- `scans` — Scan events linked to QR codes
- `subscriptions` — User subscription status (free/pro)
- `coupon_activations` — Deferred Pro activations for pre-signup payments
- `api_keys` — API key hashes for programmatic access

All tables have Row Level Security (RLS) enabled. Server routes use `SUPABASE_SERVICE_ROLE_KEY` to write data on behalf of users.
