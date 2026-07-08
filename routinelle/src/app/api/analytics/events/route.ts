import { apiError, apiOk } from "@/lib/api/response";
import { buildAnalyticsEvent, type AnalyticsEventName } from "@/lib/analytics/events";
import { rateLimitResponse } from "@/lib/rate-limit";
import { trackAnalyticsEvent } from "@/lib/supabase/routine-actions";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";

export async function POST(request: Request) {
  const rateLimited = await rateLimitResponse(request, "analytics-events");

  if (rateLimited) {
    return rateLimited;
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return apiError("validation", "Request body must be valid JSON.", 400);
  }

  try {
    const event = buildAnalyticsEvent(
      String(body.eventName) as AnalyticsEventName,
      typeof body.payload === "object" && body.payload !== null
        ? (body.payload as Record<string, unknown>)
        : {},
    );

    if (!hasEnvVars) {
      return apiOk({ tracked: false });
    }

    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    await trackAnalyticsEvent(supabase, data?.claims?.sub ?? null, event);

    return apiOk({ tracked: true });
  } catch {
    return apiError("validation", "Analytics event is not supported.", 400);
  }
}
