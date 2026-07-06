import { NextResponse } from "next/server";

import { buildSkinProfileSummary } from "@/lib/domain/skin-profile-summary";
import { createClient } from "@/lib/supabase/server";
import { upsertSkinProfile } from "@/lib/supabase/skin-profile";
import { hasEnvVars } from "@/lib/utils";
import { parseOnboardingAnswers } from "@/lib/validation/onboarding-schema";

type ApiErrorCode = "auth-required" | "validation" | "system-error";

type SkinProfileRequestBody = {
  answers?: unknown;
  routineRegenerationRequired?: unknown;
};

function errorResponse(code: ApiErrorCode, message: string, status: number) {
  const response = NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message,
      },
    },
    { status },
  );
  response.headers.set("Cache-Control", "no-store");
  return response;
}

function successResponse(data: unknown) {
  const response = NextResponse.json({
    ok: true,
    data,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

async function getAuthenticatedContext() {
  if (!hasEnvVars) {
    return { supabase: null, userId: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) {
    return { supabase, userId: null };
  }

  return { supabase, userId };
}

export async function PUT(request: Request) {
  let body: SkinProfileRequestBody;

  try {
    body = (await request.json()) as SkinProfileRequestBody;
  } catch {
    return errorResponse("validation", "Request body must be valid JSON.", 400);
  }

  const parsedAnswers = parseOnboardingAnswers(body.answers);
  if (!parsedAnswers.ok) {
    return errorResponse(
      "validation",
      parsedAnswers.errors[0]?.message ?? "Profile answers are incomplete.",
      400,
    );
  }

  if (typeof body.routineRegenerationRequired !== "boolean") {
    return errorResponse(
      "validation",
      "Routine regeneration state must be provided.",
      400,
    );
  }

  try {
    const { supabase, userId } = await getAuthenticatedContext();

    if (!supabase || !userId) {
      return errorResponse(
        "auth-required",
        "Profile updates are saved for this session unless you sign in.",
        401,
      );
    }

    const summary = buildSkinProfileSummary(parsedAnswers.answers);
    const profile = await upsertSkinProfile(supabase, userId, {
      answers: parsedAnswers.answers,
      summary,
      routineRegenerationRequired: body.routineRegenerationRequired,
    });

    return successResponse(profile);
  } catch {
    return errorResponse(
      "system-error",
      "Profile updates could not be saved right now.",
      500,
    );
  }
}
