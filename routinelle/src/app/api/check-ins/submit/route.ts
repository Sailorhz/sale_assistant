import { apiError, apiOk } from "@/lib/api/response";
import { buildAnalyticsEvent } from "@/lib/analytics/events";
import type { RoutineCheckInInput } from "@/lib/domain/check-in";
import { adjustedGuidanceFromCheckIn } from "@/lib/domain/check-in";
import {
  logSafetyEvent,
  submitRoutineCheckIn,
  trackAnalyticsEvent,
} from "@/lib/supabase/routine-actions";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";

export async function POST(request: Request) {
  if (!hasEnvVars) {
    return apiError("auth-required", "Sign in to submit check-ins.", 401);
  }

  let input: RoutineCheckInInput;
  try {
    input = (await request.json()) as RoutineCheckInInput;
  } catch {
    return apiError("validation", "Request body must be valid JSON.", 400);
  }

  if (!input.routineId) {
    return apiError("validation", "Routine ID is required.", 400);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    const userId = data?.claims?.sub;

    if (error || !userId) {
      return apiError("auth-required", "Sign in to submit check-ins.", 401);
    }

    const checkIn = await submitRoutineCheckIn(supabase, userId, input);
    const guidance = adjustedGuidanceFromCheckIn(checkIn.summary);
    await trackAnalyticsEvent(
      supabase,
      userId,
      buildAnalyticsEvent("check_in.completed", {
        routineId: input.routineId,
        seriousSignal: checkIn.summary.hasSeriousSignal,
      }),
    ).catch(() => undefined);

    if (checkIn.summary.hasSeriousSignal) {
      await logSafetyEvent(supabase, {
        userId,
        routineId: input.routineId,
        productId: null,
        category: "check_in_professional_care",
        severity: "high",
        context: { routineId: input.routineId },
      }).catch((error) => {
        console.error("Failed to log safety event for check-in", error);
      });
    }

    return apiOk({ checkIn, guidance });
  } catch {
    return apiError("system-error", "Check-in could not be submitted.", 500);
  }
}
