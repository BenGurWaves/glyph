const DAILY_FREE_LIMIT = 20;

// Simple in-memory rate limiter (resets on deploy/restart)
// For production at scale, use Cloudflare KV or Supabase
const dailyCounts = new Map<string, { count: number; resetAt: number }>();

export function checkDailyLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
} {
  const now = Date.now();
  const entry = dailyCounts.get(identifier);

  // Reset at midnight UTC
  const todayMidnight = new Date();
  todayMidnight.setUTCHours(0, 0, 0, 0);
  const nextMidnight = todayMidnight.getTime() + 86400000;

  if (!entry || now >= entry.resetAt) {
    dailyCounts.set(identifier, { count: 1, resetAt: nextMidnight });
    return { allowed: true, remaining: DAILY_FREE_LIMIT - 1 };
  }

  if (entry.count >= DAILY_FREE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: DAILY_FREE_LIMIT - entry.count };
}
