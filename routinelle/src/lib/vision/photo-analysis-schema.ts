import { onboardingQuestions } from "@/lib/domain/onboarding";
import type { PhotoAnalysisOutcome, PhotoAnalysisResult } from "@/lib/domain/photo-analysis";
import type { SkinConcern, SkinType } from "@/lib/domain/skin-profile";

const OUTCOMES: PhotoAnalysisOutcome[] = [
  "analyzed",
  "no_face_detected",
  "needs_professional_care",
  "unsupported_image",
  "declined",
];

/**
 * The concrete, classifiable values for a question -- excludes
 * `confidence: "unknown"` options (e.g. "notSure") since the model should
 * either give a real cosmetic read or use one of the non-classification
 * outcomes (no_face_detected/unsupported_image/needs_professional_care), not
 * a "not sure" guess. Derived from the same `onboardingQuestions` array the
 * real question UI uses, so a future option added there needs no separate
 * change here.
 */
function classifiableOptionValues(questionId: "skinType" | "concerns"): string[] {
  const question = onboardingQuestions.find((item) => item.id === questionId);

  if (!question) {
    throw new Error(`Onboarding question "${questionId}" not found.`);
  }

  return question.options
    .filter((option) => option.confidence !== "unknown")
    .map((option) => String(option.value));
}

export function buildPhotoAnalysisJsonSchema() {
  const skinTypeValues = classifiableOptionValues("skinType");
  const concernValues = classifiableOptionValues("concerns");

  return {
    name: "photo_skin_analysis",
    schema: {
      type: "object",
      additionalProperties: false,
      required: ["outcome"],
      properties: {
        outcome: { type: "string", enum: OUTCOMES },
        skinType: { type: "string", enum: skinTypeValues },
        concerns: {
          type: "array",
          items: { type: "string", enum: concernValues },
          maxItems: 3,
        },
      },
    },
  };
}

/**
 * Hand-validates the model's parsed JSON output the same way the rest of
 * this codebase validates input (see parseOnboardingAnswers's
 * getAllowedValues pattern) -- no schema-validation library dependency.
 * Returns null when the payload doesn't match the expected shape at all
 * (caller should treat that as a system error, not a graceful outcome,
 * since the model is JSON-schema-constrained and malformed output means the
 * integration itself is broken).
 */
export function parsePhotoAnalysisModelOutput(raw: unknown): Pick<
  PhotoAnalysisResult,
  "outcome" | "skinType" | "concerns"
> | null {
  if (typeof raw !== "object" || raw === null) {
    return null;
  }

  const record = raw as Record<string, unknown>;
  const outcome = record.outcome;

  if (typeof outcome !== "string" || !OUTCOMES.includes(outcome as PhotoAnalysisOutcome)) {
    return null;
  }

  if (outcome !== "analyzed") {
    return { outcome: outcome as PhotoAnalysisOutcome };
  }

  const skinTypeValues = classifiableOptionValues("skinType");
  const concernValues = classifiableOptionValues("concerns");

  const skinType = record.skinType;

  if (typeof skinType !== "string" || !skinTypeValues.includes(skinType)) {
    return null;
  }

  const concernsRaw = Array.isArray(record.concerns) ? record.concerns : [];
  const concerns = concernsRaw.filter(
    (value): value is string => typeof value === "string" && concernValues.includes(value),
  );

  return {
    outcome: "analyzed",
    skinType: skinType as SkinType,
    concerns: concerns as SkinConcern[],
  };
}
