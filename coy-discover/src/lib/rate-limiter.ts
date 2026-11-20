import "server-only";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const globalForRateLimit = globalThis as typeof globalThis & {
  coySwipeRateLimit?: Map<string, RateLimitEntry>;
};

const swipeRateLimit =
  globalForRateLimit.coySwipeRateLimit ??
  new Map<string, RateLimitEntry>();

globalForRateLimit.coySwipeRateLimit = swipeRateLimit;

export function checkSwipeRateLimit(
  key: string,
  limit = 30,
  windowMs = 60_000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();

  for (const [entryKey, entry] of swipeRateLimit) {
    if (entry.resetAt <= now) {
      swipeRateLimit.delete(entryKey);
    }
  }

  const existing = swipeRateLimit.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    swipeRateLimit.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: limit - 1,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((existing.resetAt - now) / 1000)
      ),
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: limit - existing.count,
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((existing.resetAt - now) / 1000)
    ),
  };
}
