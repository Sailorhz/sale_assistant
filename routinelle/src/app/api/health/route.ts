import * as Sentry from "@sentry/nextjs";

import { apiError, apiOk } from "@/lib/api/response";
import { rateLimitResponse } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";

/**
 * Exercises the real Supabase dependency, not just Next.js liveness -- a
 * static "is the server up" check would have stayed green through the
 * DNS outage that made routine generation silently fail for hours. Point an
 * external uptime monitor at this route, not at "/".
 */
export async function GET(request: Request) {
  const rateLimited = await rateLimitResponse(request, "health-check");

  if (rateLimited) {
    return rateLimited;
  }

  if (!hasEnvVars) {
    return apiError("system-error", "Supabase is not configured.", 503);
  }

  const start = Date.now();

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("catalog_products")
      .select("id")
      .limit(1);

    if (error) {
      throw error;
    }

    return apiOk({
      status: "healthy",
      checks: { database: "ok" },
      latencyMs: Date.now() - start,
    });
  } catch (error) {
    Sentry.captureException(error);
    return apiError(
      "system-error",
      "Health check failed: database is unreachable.",
      503,
    );
  }
}
