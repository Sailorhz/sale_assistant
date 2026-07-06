import { NextResponse } from "next/server";

import {
  recommendationDataUseSummary,
  mvpPermissionBoundaries,
  type PrivacyConsentInput,
} from "@/lib/domain/privacy-consent";
import {
  getPrivacyConsent,
  upsertPrivacyConsent,
} from "@/lib/supabase/privacy-consent";
import { createClient } from "@/lib/supabase/server";

type ApiErrorCode = "auth-required" | "validation" | "system-error";

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
        "Sign in to view privacy consent.",
        401,
      );
    }

    const consent = await getPrivacyConsent(supabase, userId);

    return successResponse({
      consent,
      dataUseSummary: recommendationDataUseSummary,
      permissionBoundaries: mvpPermissionBoundaries,
    });
  } catch {
    return errorResponse(
      "system-error",
      "Privacy consent is unavailable right now.",
      500,
    );
  }
}

export async function POST(request: Request) {
  let body: Partial<PrivacyConsentInput>;

  try {
    body = (await request.json()) as Partial<PrivacyConsentInput>;
  } catch {
    return errorResponse("validation", "Request body must be valid JSON.", 400);
  }

  try {
    if (
      typeof body.profileRoutineStorageConsent !== "boolean" ||
      typeof body.outcomeTrackingConsent !== "boolean"
    ) {
      return errorResponse(
        "validation",
        "Consent values must be true or false.",
        400,
      );
    }

    const { supabase, userId } = await getAuthenticatedContext();

    if (!userId) {
      return errorResponse(
        "auth-required",
        "Sign in to update privacy consent.",
        401,
      );
    }

    const consent = await upsertPrivacyConsent(supabase, userId, {
      profileRoutineStorageConsent: body.profileRoutineStorageConsent,
      outcomeTrackingConsent: body.outcomeTrackingConsent,
    });

    return successResponse({
      consent,
      dataUseSummary: recommendationDataUseSummary,
      permissionBoundaries: mvpPermissionBoundaries,
    });
  } catch {
    return errorResponse(
      "system-error",
      "Privacy consent could not be saved right now.",
      500,
    );
  }
}
