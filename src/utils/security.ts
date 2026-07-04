/**
 * Server-side IP-keyed in-memory rate limiter for the CV download gate.
 * Resets on server restart — acceptable for this threat model.
 * For multi-instance / serverless deployments, replace the Map with Upstash Redis.
 */

interface AttemptRecord {
  count: number;
  lockUntil?: number; // epoch ms
}

const store = new Map<string, AttemptRecord>();

export const MAX_ATTEMPTS = 5;
export const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export interface RateLimitResult {
  allowed: boolean;
  attemptsLeft: number;
  retryAfterSeconds?: number;
}

export function checkRateLimit(ip: string): RateLimitResult {
  const rec = store.get(ip);

  if (!rec) {
    return { allowed: true, attemptsLeft: MAX_ATTEMPTS };
  }

  // Active lockout?
  if (rec.lockUntil !== undefined) {
    const now = Date.now();
    if (now < rec.lockUntil) {
      return {
        allowed: false,
        attemptsLeft: 0,
        retryAfterSeconds: Math.ceil((rec.lockUntil - now) / 1000),
      };
    }
    // Expired — reset
    store.delete(ip);
    return { allowed: true, attemptsLeft: MAX_ATTEMPTS };
  }

  const attemptsLeft = MAX_ATTEMPTS - rec.count;
  return { allowed: attemptsLeft > 0, attemptsLeft: Math.max(0, attemptsLeft) };
}

export function recordFailedAttempt(ip: string): RateLimitResult {
  const rec = store.get(ip) ?? { count: 0 };
  const newCount = rec.count + 1;

  if (newCount >= MAX_ATTEMPTS) {
    const lockUntil = Date.now() + LOCKOUT_MS;
    store.set(ip, { count: newCount, lockUntil });
    return {
      allowed: false,
      attemptsLeft: 0,
      retryAfterSeconds: Math.ceil(LOCKOUT_MS / 1000),
    };
  }

  store.set(ip, { count: newCount });
  return { allowed: true, attemptsLeft: MAX_ATTEMPTS - newCount };
}
