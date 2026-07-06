import { NextResponse } from "next/server";

import {
  PROFILE_DELETION_CONFIRMATION,
  buildAccountDataSummary,
} from "@/lib/domain/account-data";
import {
  createProfileDeletionRequest,
  getOpenProfileDeletionRequest,
} from "@/lib/supabase/profile-deletion";
import { upsertPrivacyConsent } from "@/lib/supabase/privacy-consent";
import { createClient } from "@/lib/supabase/server";

type ApiErrorCode = "auth-required" | "validation" | "system-error";

type ProfileDataRequestBody = {
  confirmation?: unknown;
};

function errorResponse(
  code: ApiErrorCode,
  message: string,
  status: number,
) {
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
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) {
    return { supabase, userId: null };
  }

  return { supabase, userId };
}

export async function GET() {
  try {
    const { supabase, userId } = await getAuthenticatedContext();

    if (!userId) {
      return errorResponse(
        "auth-required",
        "Sign in to view account data.",
        401,
      );
    }

    const deletionRequest = await getOpenProfileDeletionRequest(
      supabase,
      userId,
    );

    return successResponse(buildAccountDataSummary(deletionRequest));
  } catch {
    return errorResponse(
      "system-error",
      "Account data is unavailable right now.",
      500,
    );
  }
}

export async function POST(request: Request) {
  let body: ProfileDataRequestBody;

  try {
    body = (await request.json()) as ProfileDataRequestBody;
  } catch {
    return errorResponse("validation", "Request body must be valid JSON.", 400);
  }

  try {
    if (body.confirmation !== PROFILE_DELETION_CONFIRMATION) {
      return errorResponse(
        "validation",
        `Type ${PROFILE_DELETION_CONFIRMATION} to request profile data deletion.`,
        400,
      );
    }

    const { supabase, userId } = await getAuthenticatedContext();

    if (!userId) {
      return errorResponse(
        "auth-required",
        "Sign in to request profile data deletion.",
        401,
      );
    }

    const deletionRequest = await createProfileDeletionRequest(
      supabase,
      userId,
    );

    await upsertPrivacyConsent(supabase, userId, {
      profileRoutineStorageConsent: false,
      outcomeTrackingConsent: false,
    });

    return successResponse(buildAccountDataSummary(deletionRequest));
  } catch {
    return errorResponse(
      "system-error",
      "Profile data deletion could not be requested right now.",
      500,
    );
  }
}
