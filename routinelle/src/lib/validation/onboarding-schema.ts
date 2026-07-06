import {
  onboardingQuestions,
  type OnboardingQuestionId,
} from "@/lib/domain/onboarding";
import type { OnboardingAnswers } from "@/lib/domain/skin-profile";

export type OnboardingValidationError = {
  questionId: OnboardingQuestionId;
  message: string;
};

export type OnboardingValidationResult =
  | {
      ok: true;
      errors: [];
    }
  | {
      ok: false;
      errors: OnboardingValidationError[];
    };

export type OnboardingAnswersParseResult =
  | {
      ok: true;
      answers: OnboardingAnswers;
    }
  | {
      ok: false;
      errors: OnboardingValidationError[];
    };

function getMissingAnswerMessage(
  question: (typeof onboardingQuestions)[number] | undefined,
) {
  if (question?.options.some((option) => option.value === "notSure")) {
    return "Choose an answer to continue. Select not sure if needed.";
  }

  if (question?.options.some((option) => option.value === "none")) {
    return "Choose an answer to continue. Select none if nothing applies.";
  }

  return "Choose at least one option to continue.";
}

export function validateOnboardingQuestion(
  answers: OnboardingAnswers,
  questionId: OnboardingQuestionId,
): OnboardingValidationResult {
  const question = onboardingQuestions.find((item) => item.id === questionId);
  if (question?.showWhen && !question.showWhen(answers)) {
    return { ok: true, errors: [] };
  }

  const value = answers[questionId];
  const hasAnswer = Array.isArray(value) ? value.length > 0 : value !== null;

  if (hasAnswer) {
    return { ok: true, errors: [] };
  }

  return {
    ok: false,
    errors: [
      {
        questionId,
        message: getMissingAnswerMessage(question),
      },
    ],
  };
}

export function validateOnboardingAnswers(
  answers: OnboardingAnswers,
): OnboardingValidationResult {
  const errors = onboardingQuestions.flatMap((question) => {
    if (question.showWhen && !question.showWhen(answers)) {
      return [];
    }

    const result = validateOnboardingQuestion(answers, question.id);
    return result.ok ? [] : result.errors;
  });

  return errors.length === 0 ? { ok: true, errors: [] } : { ok: false, errors };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getAllowedValues(question: (typeof onboardingQuestions)[number]) {
  return new Set<string>(question.options.map((option) => option.value));
}

export function parseOnboardingAnswers(
  input: unknown,
): OnboardingAnswersParseResult {
  if (!isRecord(input)) {
    return {
      ok: false,
      errors: [
        {
          questionId: "skinType",
          message: "Profile answers must be an object.",
        },
      ],
    };
  }

  const errors: OnboardingValidationError[] = [];
  const answers = {} as OnboardingAnswers;

  for (const question of onboardingQuestions) {
    const value = input[question.id];
    const allowedValues = getAllowedValues(question);

    if (question.kind === "single") {
      if (typeof value !== "string" || !allowedValues.has(value)) {
        errors.push({
          questionId: question.id,
          message: "Choose a supported answer to continue.",
        });
        continue;
      }

      Object.assign(answers, { [question.id]: value });
      continue;
    }

    if (value === undefined) {
      Object.assign(answers, { [question.id]: [] });
      continue;
    }

    if (!Array.isArray(value)) {
      errors.push({
        questionId: question.id,
        message: "Choose supported answers to continue.",
      });
      continue;
    }

    const uniqueValues = Array.from(new Set(value));
    const hasInvalidValue = uniqueValues.some(
      (item) => typeof item !== "string" || !allowedValues.has(item),
    );
    const selectedExclusiveValues = uniqueValues.filter((item) =>
      question.exclusiveValues?.includes(item),
    );
    const hasExclusiveConflict =
      selectedExclusiveValues.length > 0 && uniqueValues.length > 1;
    const exceedsMaxSelections =
      question.maxSelections !== undefined &&
      uniqueValues.length > question.maxSelections;

    if (hasInvalidValue || hasExclusiveConflict || exceedsMaxSelections) {
      errors.push({
        questionId: question.id,
        message: "Choose supported answers to continue.",
      });
      continue;
    }

    Object.assign(answers, { [question.id]: uniqueValues });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  if (answers.currentRoutineChoice !== "addBasics") {
    answers.currentRoutineProductTypes = [];
  }

  const validation = validateOnboardingAnswers(answers);
  if (!validation.ok) {
    return { ok: false, errors: validation.errors };
  }

  return { ok: true, answers };
}
