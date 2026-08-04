import * as Sentry from "@sentry/nextjs";

import { apiError, apiOk } from "@/lib/api/response";
import {
  PHOTO_ANALYSIS_CONSENT_VERSION,
} from "@/lib/domain/photo-analysis-consent";
import {
  PHOTO_ANALYSIS_OUTCOME_MESSAGES,
  type PhotoAnalysisResult,
} from "@/lib/domain/photo-analysis";
import { rateLimitResponse } from "@/lib/rate-limit";
import { logPhotoAnalysisEvent } from "@/lib/supabase/photo-analysis";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";
import {
  callPhotoAnalysisModel,
  hasAnthropicEnvVars,
  PHOTO_ANALYSIS_MODEL,
} from "@/lib/vision/anthropic-client";
import {
  buildPhotoAnalysisJsonSchema,
  parsePhotoAnalysisModelOutput,
} from "@/lib/vision/photo-analysis-schema";

const ALLOWED_MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
type AllowedMediaType = (typeof ALLOWED_MEDIA_TYPES)[number];

// ~8MB of raw image data, base64-encoded (base64 inflates size by ~4/3).
const MAX_BASE64_LENGTH = 11_000_000;

type PhotoSuggestionRequestBody = {
  image?: unknown;
  mediaType?: unknown;
  consent?: { granted?: unknown };
};

function isAllowedMediaType(value: unknown): value is AllowedMediaType {
  return (
    typeof value === "string" &&
    (ALLOWED_MEDIA_TYPES as readonly string[]).includes(value)
  );
}

async function logEvent(result: PhotoAnalysisResult, errorCode: string | null) {
  if (!hasEnvVars) {
    return;
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const userId = data?.claims?.sub ?? null;

    await logPhotoAnalysisEvent(supabase, {
      userId,
      consentVersion: PHOTO_ANALYSIS_CONSENT_VERSION,
      outcome: result.outcome,
      model: PHOTO_ANALYSIS_MODEL,
      skinTypeSuggestion: result.skinType ?? null,
      concernsSuggestion: result.concerns ?? null,
      errorCode,
    });
  } catch (error) {
    console.error("Failed to log photo analysis event", error);
    Sentry.captureException(error);
  }
}

export async function POST(request: Request) {
  const rateLimited = await rateLimitResponse(request, "onboarding-photo-suggestion");

  if (rateLimited) {
    return rateLimited;
  }

  let body: PhotoSuggestionRequestBody;

  try {
    body = (await request.json()) as PhotoSuggestionRequestBody;
  } catch {
    return apiError("validation", "Request body must be valid JSON.", 400);
  }

  if (typeof body.image !== "string" || body.image.length === 0) {
    return apiError("validation", "A photo is required.", 400);
  }

  if (body.image.length > MAX_BASE64_LENGTH) {
    return apiError("validation", "That photo is too large. Try a smaller one.", 400);
  }

  if (!isAllowedMediaType(body.mediaType)) {
    return apiError("validation", "Unsupported image format.", 400);
  }

  if (body.consent?.granted !== true) {
    return apiError("validation", "Consent is required to analyze a photo.", 400);
  }

  if (!hasAnthropicEnvVars) {
    return apiError(
      "system-error",
      "Photo analysis is unavailable right now. You can continue by answering the questions instead.",
      503,
    );
  }

  try {
    const schema = buildPhotoAnalysisJsonSchema();
    const response = await callPhotoAnalysisModel(body.image, body.mediaType, schema);

    if (response.refused) {
      const result: PhotoAnalysisResult = {
        outcome: "declined",
        message: PHOTO_ANALYSIS_OUTCOME_MESSAGES.declined,
      };
      await logEvent(result, null);
      return apiOk(result);
    }

    const parsed = parsePhotoAnalysisModelOutput(response.parsed);

    if (!parsed) {
      return apiError(
        "system-error",
        "Photo analysis is unavailable right now. You can continue by answering the questions instead.",
        503,
      );
    }

    const result: PhotoAnalysisResult = {
      ...parsed,
      message: PHOTO_ANALYSIS_OUTCOME_MESSAGES[parsed.outcome],
    };

    await logEvent(result, null);
    return apiOk(result);
  } catch (error) {
    console.error("Photo analysis call failed", error);
    Sentry.captureException(error);
    await logEvent(
      { outcome: "declined", message: PHOTO_ANALYSIS_OUTCOME_MESSAGES.declined },
      "anthropic_call_failed",
    );
    return apiError(
      "system-error",
      "Photo analysis is unavailable right now. You can continue by answering the questions instead.",
      503,
    );
  }
}
