import type { Duration } from "@upstash/ratelimit";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { apiError } from "@/lib/api/response";

/**
 * Same graceful-degradation pattern as `hasEnvVars` in `src/lib/utils.ts`:
 * a plain truthy check on the required env vars, not coerced to boolean,
 * so callers can gate behavior without the module throwing at import time.
 */
export const hasRateLimitEnvVars =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

/** Which identifier a bucket is scoped by. */
export type RateLimitScope = "ip" | "user";

export type RateLimitBucketConfig = {
  scope: RateLimitScope;
  limit: number;
  window: Duration;
};

/**
 * Named buckets for the six public POST endpoints. Routes that need both an
 * IP guard (pre-auth) and a user guard (post-auth) get two entries — one per
 * scope — since they carry different limits/windows (see plan §1 table).
 */
export type RateLimitBucket =
  | "routines-generate"
  | "routines-save-ip"
  | "routines-save-user"
  | "check-ins-submit-ip"
  | "check-ins-submit-user"
  | "safety-events-report"
  | "analytics-events"
  | "product-actions-click";

export const RATE_LIMITS: Record<RateLimitBucket, RateLimitBucketConfig> = {
  "routines-generate": { scope: "ip", limit: 20, window: "60 s" },
  "routines-save-ip": { scope: "ip", limit: 15, window: "60 s" },
  "routines-save-user": { scope: "user", limit: 10, window: "60 s" },
  "check-ins-submit-ip": { scope: "ip", limit: 20, window: "60 s" },
  "check-ins-submit-user": { scope: "user", limit: 8, window: "600 s" },
  "safety-events-report": { scope: "ip", limit: 20, window: "60 s" },
  "analytics-events": { scope: "ip", limit: 60, window: "60 s" },
  "product-actions-click": { scope: "ip", limit: 40, window: "60 s" },
};

export type RateLimitCheckResult =
  | { limited: false }
  | { limited: true; retryAfterSeconds: number };

/**
 * Parses the caller's IP from standard proxy headers. Pure and
 * unit-testable — takes the first (left-most, i.e. original client) entry
 * of `x-forwarded-for`, falls back to `x-real-ip`, then "unknown".
 */
export function getRequestIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    const [first] = forwardedFor.split(",");
    const trimmed = first?.trim();

    if (trimmed) {
      return trimmed;
    }
  }

  const realIp = request.headers.get("x-real-ip");

  if (realIp) {
    const trimmed = realIp.trim();

    if (trimmed) {
      return trimmed;
    }
  }

  return "unknown";
}

/** Builds a scoped Redis key identifier, e.g. "ip:203.0.113.5" or "user:<uuid>". */
export function buildIdentifier(scope: RateLimitScope, value: string): string {
  return `${scope}:${value}`;
}

let redisClient: Redis | null = null;

function getRedis(): Redis {
  if (!redisClient) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL as string,
      token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
    });
  }

  return redisClient;
}

const ratelimiters = new Map<RateLimitBucket, Ratelimit>();

function getRatelimiter(bucket: RateLimitBucket): Ratelimit {
  const existing = ratelimiters.get(bucket);

  if (existing) {
    return existing;
  }

  const config = RATE_LIMITS[bucket];
  const ratelimiter = new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.slidingWindow(config.limit, config.window),
    prefix: `routinelle/rate-limit/${bucket}`,
  });

  ratelimiters.set(bucket, ratelimiter);
  return ratelimiter;
}

/**
 * Checks whether `identifier` has exceeded `bucket`'s limit. **Fails open**
 * (returns `{ limited: false }`) whenever Upstash env vars are absent (local
 * dev without Upstash creds, CI) or whenever the Upstash call itself throws —
 * this must never be the reason a legitimate request, especially a
 * safety-escalation one, gets dropped.
 */
export async function checkRateLimit(
  bucket: RateLimitBucket,
  identifier: string,
): Promise<RateLimitCheckResult> {
  if (!hasRateLimitEnvVars) {
    return { limited: false };
  }

  try {
    const ratelimiter = getRatelimiter(bucket);
    const result = await ratelimiter.limit(identifier);

    if (result.success) {
      return { limited: false };
    }

    const retryAfterSeconds = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
    return { limited: true, retryAfterSeconds };
  } catch (error) {
    console.error(`Rate limit check failed for bucket "${bucket}"`, error);
    return { limited: false };
  }
}

/**
 * Thin route-facing helper. Resolves the right identifier for `bucket`'s
 * scope (IP from the request, or the given `userId`) and returns a ready
 * 429 `apiError(...)` response with a `Retry-After` header when the caller
 * is over the limit, or `null` when the request may proceed.
 */
export async function rateLimitResponse(
  request: Request,
  bucket: RateLimitBucket,
  userId?: string | null,
) {
  const config = RATE_LIMITS[bucket];
  const identifier =
    config.scope === "user"
      ? buildIdentifier("user", userId ?? "unknown")
      : buildIdentifier("ip", getRequestIp(request));

  const result = await checkRateLimit(bucket, identifier);

  if (!result.limited) {
    return null;
  }

  return apiError(
    "rate-limited",
    "Too many requests. Please try again shortly.",
    429,
    undefined,
    { "Retry-After": String(result.retryAfterSeconds) },
  );
}
