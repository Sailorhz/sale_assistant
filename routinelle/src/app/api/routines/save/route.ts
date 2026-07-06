import { apiError, apiOk } from "@/lib/api/response";
import { buildAnalyticsEvent } from "@/lib/analytics/events";
import type { GeneratedRoutine } from "@/lib/domain/routine";
import { persistGeneratedRoutine } from "@/lib/supabase/generated-routines";
import { trackAnalyticsEvent } from "@/lib/supabase/routine-actions";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function hasPersistableVersionContext(routine: GeneratedRoutine) {
  return (
    uuidPattern.test(routine.versionContext.catalogVersionId) &&
    uuidPattern.test(routine.versionContext.ruleVersionId)
  );
}

export async function POST(request: Request) {
  if (!hasEnvVars) {
    return apiError("auth-required", "Sign in to save routines.", 401);
  }

  let body: { routine?: GeneratedRoutine };
  try {
    body = (await request.json()) as { routine?: GeneratedRoutine };
  } catch {
    return apiError("validation", "Request body must be valid JSON.", 400);
  }

  if (!body.routine || body.routine.state === "safety-blocked") {
    return apiError("validation", "Only safe generated routines can be saved.", 400);
  }

  if (!hasPersistableVersionContext(body.routine)) {
    return apiError(
      "validation",
      "Routine must be generated from published catalog and rule versions before it can be saved.",
      400,
    );
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    const userId = data?.claims?.sub;

    if (error || !userId) {
      return apiError("auth-required", "Sign in to save routines.", 401);
    }

    const routine = await persistGeneratedRoutine(supabase, userId, body.routine);
    await trackAnalyticsEvent(
      supabase,
      userId,
      buildAnalyticsEvent("routine.saved", {
        routineId: routine.id,
        routineState: routine.state,
      }),
    ).catch(() => undefined);

    return apiOk({ routine });
  } catch {
    return apiError("system-error", "Routine could not be saved.", 500);
  }
}
