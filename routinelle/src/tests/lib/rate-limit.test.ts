import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { buildIdentifier, getRequestIp } from "@/lib/rate-limit";

function requestWithHeaders(headers: Record<string, string>): Request {
  return new Request("https://example.com/api/test", { headers });
}

describe("getRequestIp", () => {
  it("parses the first entry of x-forwarded-for and trims it", () => {
    const request = requestWithHeaders({
      "x-forwarded-for": "  203.0.113.5 , 70.41.3.18, 150.172.238.178",
    });

    expect(getRequestIp(request)).toBe("203.0.113.5");
  });

  it("falls back to x-real-ip when x-forwarded-for is absent", () => {
    const request = requestWithHeaders({ "x-real-ip": "198.51.100.23" });

    expect(getRequestIp(request)).toBe("198.51.100.23");
  });

  it('falls back to "unknown" when neither header is present', () => {
    const request = requestWithHeaders({});

    expect(getRequestIp(request)).toBe("unknown");
  });
});

describe("buildIdentifier", () => {
  it('builds an "ip:<value>" identifier for ip scope', () => {
    expect(buildIdentifier("ip", "203.0.113.5")).toBe("ip:203.0.113.5");
  });

  it('builds a "user:<value>" identifier for user scope', () => {
    expect(buildIdentifier("user", "user-123")).toBe("user:user-123");
  });
});

describe("checkRateLimit fail-open behavior", () => {
  const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
  const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  beforeEach(() => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    vi.resetModules();
  });

  afterEach(() => {
    if (originalUrl === undefined) {
      delete process.env.UPSTASH_REDIS_REST_URL;
    } else {
      process.env.UPSTASH_REDIS_REST_URL = originalUrl;
    }

    if (originalToken === undefined) {
      delete process.env.UPSTASH_REDIS_REST_TOKEN;
    } else {
      process.env.UPSTASH_REDIS_REST_TOKEN = originalToken;
    }

    vi.resetModules();
  });

  it("returns { limited: false } with no Upstash env vars set, with no live network call", async () => {
    // Re-imported fresh (via resetModules) after deleting the env vars above,
    // so `hasRateLimitEnvVars` reflects the unset state regardless of what
    // was true when this test file's static imports first ran.
    const rateLimit = await import("@/lib/rate-limit");

    expect(rateLimit.hasRateLimitEnvVars).toBeFalsy();

    const result = await rateLimit.checkRateLimit("routines-generate", "ip:203.0.113.5");

    expect(result).toEqual({ limited: false });
  });

  it("fails open independently for every bucket when env vars are unset", async () => {
    const { checkRateLimit, RATE_LIMITS } = await import("@/lib/rate-limit");

    for (const bucket of Object.keys(RATE_LIMITS) as (keyof typeof RATE_LIMITS)[]) {
      const result = await checkRateLimit(bucket, "ip:203.0.113.5");
      expect(result).toEqual({ limited: false });
    }
  });
});
