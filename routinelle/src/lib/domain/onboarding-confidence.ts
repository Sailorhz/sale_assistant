import {
  onboardingQuestions,
  type OnboardingOption,
  type OnboardingQuestion,
  type OnboardingQuestionId,
} from "@/lib/domain/onboarding";
import type { OnboardingAnswers } from "@/lib/domain/skin-profile";

export type OnboardingQuestionConfidence =
  | "unanswered"
  | "answered"
  | "unknown";

export type OnboardingConfidenceMap = Record<
  OnboardingQuestionId,
  OnboardingQuestionConfidence
>;

function getOptionConfidence(option: OnboardingOption | undefined) {
  return option?.confidence ?? "answered";
}

function findOption(
  question: OnboardingQuestion,
  value: string,
): OnboardingOption | undefined {
  return question.options.find((option) => option.value === value);
}

export function getOnboardingQuestionConfidence(
  answers: OnboardingAnswers,
  question: OnboardingQuestion,
): OnboardingQuestionConfidence {
  const answer = answers[question.id];

  if (Array.isArray(answer)) {
    if (answer.length === 0) {
      return "unanswered";
    }

    return answer.some(
      (value) => getOptionConfidence(findOption(question, value)) === "unknown",
    )
      ? "unknown"
      : "answered";
  }

  if (answer === null) {
    return "unanswered";
  }

  return getOptionConfidence(findOption(question, answer));
}

export function getOnboardingConfidenceMap(
  answers: OnboardingAnswers,
): OnboardingConfidenceMap {
  return Object.fromEntries(
    onboardingQuestions.map((question) => [
      question.id,
      getOnboardingQuestionConfidence(answers, question),
    ]),
  ) as OnboardingConfidenceMap;
}

export function hasUnknownOnboardingAnswers(answers: OnboardingAnswers) {
  return Object.values(getOnboardingConfidenceMap(answers)).includes("unknown");
}
