import {
  getOnboardingQuestionConfidence,
  type OnboardingQuestionConfidence,
} from "@/lib/domain/onboarding-confidence";
import {
  onboardingQuestions,
  type OnboardingQuestionId,
} from "@/lib/domain/onboarding";
import type { OnboardingAnswers } from "@/lib/domain/skin-profile";

export type SkinProfileSummaryItem = {
  id: OnboardingQuestionId;
  label: string;
  value: string;
  confidence: OnboardingQuestionConfidence;
};

export type RoutineRiskFlagTone = "neutral" | "caution";

export type RoutineRiskFlag = {
  id: string;
  label: string;
  detail: string;
  tone: RoutineRiskFlagTone;
  editQuestionId: OnboardingQuestionId;
};

export type SkinProfileSummary = {
  items: SkinProfileSummaryItem[];
  riskFlags: RoutineRiskFlag[];
};

const baseSummaryQuestionIds: OnboardingQuestionId[] = [
  "skinType",
  "concerns",
  "sensitivity",
  "budget",
  "localMarket",
  "currentRoutineChoice",
];

function findQuestion(questionId: OnboardingQuestionId) {
  return onboardingQuestions.find((question) => question.id === questionId);
}

function getAnswerLabels(answers: OnboardingAnswers, questionId: OnboardingQuestionId) {
  const question = findQuestion(questionId);
  const answer = answers[questionId];

  if (!question || answer === null || (Array.isArray(answer) && answer.length === 0)) {
    return "Not answered";
  }

  const values = Array.isArray(answer) ? answer : [answer];
  return values
    .map((value) => {
      const option = question.options.find((item) => item.value === value);
      return option?.label ?? String(value);
    })
    .join(", ");
}

function getSummaryLabel(questionId: OnboardingQuestionId) {
  switch (questionId) {
    case "skinType":
      return "Skin type";
    case "concerns":
      return "Main concerns";
    case "sensitivity":
      return "Sensitivity";
    case "budget":
      return "Budget";
    case "localMarket":
      return "Market";
    case "currentRoutineChoice":
      return "Current routine";
    case "currentRoutineProductTypes":
      return "Current product types";
    default:
      return questionId;
  }
}

function hasSelected(values: string[], ignored: string[] = ["none", "notSure"]) {
  return values.some((value) => !ignored.includes(value));
}

function buildRiskFlags(answers: OnboardingAnswers): RoutineRiskFlag[] {
  const flags: RoutineRiskFlag[] = [];
  const irritationSignals = answers.irritationBarrierSignals;
  const acneSignals = answers.acneOilinessSignals;
  const seriousSignals = answers.seriousSymptomSignals;
  const activeProductTypes = answers.currentRoutineProductTypes.filter((type) =>
    ["exfoliant", "retinoid", "blemishActive", "vitaminCBrightening"].includes(
      type,
    ),
  );

  if (
    answers.sensitivity === "oftenSensitive" ||
    answers.sensitivity === "currentlyUncomfortable" ||
    hasSelected(irritationSignals)
  ) {
    flags.push({
      id: "gentleStartContext",
      label: "Gentle-start context",
      detail:
        "Based on your answers, later routine logic should stay cautious with strong actives.",
      tone: "caution",
      editQuestionId: "irritationBarrierSignals",
    });
  }

  if (hasSelected(acneSignals)) {
    flags.push({
      id: "blemishOilinessContext",
      label: "Blemish and oiliness context",
      detail:
        "Based on your answers, later routine logic can consider blemish and shine support.",
      tone: "neutral",
      editQuestionId: "acneOilinessSignals",
    });
  }

  if (hasSelected(seriousSignals, ["none"])) {
    flags.push({
      id: "extraCautionContext",
      label: "Extra caution context",
      detail:
        "Based on your answers, later guidance should stay conservative and avoid overconfident wording.",
      tone: "caution",
      editQuestionId: "seriousSymptomSignals",
    });
  }

  if (activeProductTypes.length > 0) {
    flags.push({
      id: "activeStackingContext",
      label: "Active-stacking context",
      detail:
        "Based on your current routine basics, later checks should look for too many active-style steps.",
      tone: "caution",
      editQuestionId: "currentRoutineProductTypes",
    });
  }

  if (answers.currentRoutineChoice !== "addBasics") {
    flags.push({
      id: "noCurrentRoutineContext",
      label: "No current routine detail",
      detail:
        "Based on your answers, Routinelle should use a starter routine path without current-product context.",
      tone: "neutral",
      editQuestionId: "currentRoutineChoice",
    });
  }

  if (flags.length === 0) {
    flags.push({
      id: "noExtraRoutineFlags",
      label: "No extra routine flags",
      detail:
        "Based on your answers, no extra routine caution flags are visible yet.",
      tone: "neutral",
      editQuestionId: "currentRoutineChoice",
    });
  }

  return flags;
}

export function buildSkinProfileSummary(
  answers: OnboardingAnswers,
): SkinProfileSummary {
  const summaryQuestionIds =
    answers.currentRoutineChoice === "addBasics"
      ? [...baseSummaryQuestionIds, "currentRoutineProductTypes" as const]
      : baseSummaryQuestionIds;

  const items = summaryQuestionIds.map((questionId) => {
    const question = findQuestion(questionId);

    return {
      id: questionId,
      label: getSummaryLabel(questionId),
      value: getAnswerLabels(answers, questionId),
      confidence: question
        ? getOnboardingQuestionConfidence(answers, question)
        : "unanswered",
    };
  });

  return {
    items,
    riskFlags: buildRiskFlags(answers),
  };
}
