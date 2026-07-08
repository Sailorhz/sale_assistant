import { apiError, apiOk } from "@/lib/api/response";
import { buildAnalyticsEvent } from "@/lib/analytics/events";
import { rateLimitResponse } from "@/lib/rate-limit";
import { logSafetyEvent, trackAnalyticsEvent } from "@/lib/supabase/routine-actions";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";

export async function POST(request: Request) {
  const rateLimited = await rateLimitResponse(request, "safety-events-report");

  if (rateLimited) {
    return rateLimited;
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return apiError("validation", "Request body must be valid JSON.", 400);
  }

  if (!hasEnvVars) {
    return apiOk({ logged: false });
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const userId = data?.claims?.sub ?? null;
    const routineId = typeof body.routineId === "string" ? body.routineId : null;

    await logSafetyEvent(supabase, {
      userId,
      routineId,
      productId: typeof body.productId === "string" ? body.productId : null,
      category: typeof body.category === "string" ? body.category : "safety_report",
      severity: body.severity === "high" || body.severity === "medium" ? body.severity : "low",
      context: { routineId },
    });
    await trackAnalyticsEvent(
      supabase,
      userId,
      buildAnalyticsEvent("safety.professional_care_triggered", {
        routineId,
      }),
    ).catch(() => undefined);

    return apiOk({ logged: true });
  } catch {
    return apiError("system-error", "Safety event could not be logged.", 500);
  }
}
