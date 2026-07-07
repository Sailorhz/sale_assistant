"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { RoutineView } from "@/components/routinelle/routine/routine-view";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { GeneratedRoutine } from "@/lib/domain/routine";
import {
  onboardingQuestions,
  type OnboardingOptionValue,
  type OnboardingQuestion,
  type OnboardingQuestionId,
} from "@/lib/domain/onboarding";
import { getOnboardingQuestionConfidence } from "@/lib/domain/onboarding-confidence";
import {
  buildSkinProfileSummary,
  type SkinProfileSummary,
} from "@/lib/domain/skin-profile-summary";
import {
  emptyOnboardingAnswers,
  type OnboardingAnswers,
} from "@/lib/domain/skin-profile";
import { buildRoutineExplanationBundle } from "@/lib/explanations/rationale-builder";
import { cn } from "@/lib/utils";
import {
  validateOnboardingAnswers,
  validateOnboardingQuestion,
} from "@/lib/validation/onboarding-schema";

type MultiQuestionId = {
  [QuestionId in keyof OnboardingAnswers]: OnboardingAnswers[QuestionId] extends
    OnboardingOptionValue[]
    ? QuestionId
    : never;
}[keyof OnboardingAnswers];

type ProfileSaveStatus =
  | "idle"
  | "saving"
  | "saved"
  | "anonymous"
  | "unavailable";

type ProfileSaveState = {
  status: ProfileSaveStatus;
  message: string | null;
};

type RoutineGenerationState =
  | { status: "idle" }
  | { status: "generating" }
  | { status: "ready"; routine: GeneratedRoutine }
  | { status: "error"; message: string };

type RoutineSaveStatus = "idle" | "saving" | "saved" | "auth-required" | "error";

type RoutineSaveState = {
  status: RoutineSaveStatus;
  message: string | null;
};

function isMultiQuestionId(
  questionId: keyof OnboardingAnswers,
): questionId is MultiQuestionId {
  return Array.isArray(emptyOnboardingAnswers[questionId]);
}

function isSelected(
  answers: OnboardingAnswers,
  question: OnboardingQuestion,
  value: OnboardingOptionValue,
) {
  const answer = answers[question.id];

  if (Array.isArray(answer)) {
    return (answer as OnboardingOptionValue[]).includes(value);
  }

  return answer === value;
}

function getAnswerCount(answers: OnboardingAnswers) {
  return getVisibleQuestions(answers).filter((question) => {
    const answer = answers[question.id];
    return Array.isArray(answer) ? answer.length > 0 : answer !== null;
  }).length;
}

function getVisibleQuestions(answers: OnboardingAnswers) {
  return onboardingQuestions.filter(
    (question) => !question.showWhen || question.showWhen(answers),
  );
}

function getAnswersKey(answers: OnboardingAnswers) {
  return JSON.stringify(answers);
}

function SummarySection({
  summary,
  needsRoutineRegeneration,
  saveState,
  onEdit,
}: {
  summary: SkinProfileSummary;
  needsRoutineRegeneration: boolean;
  saveState: ProfileSaveState;
  onEdit: (questionId: OnboardingQuestionId) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase text-[#53685d]">
          Based on your answers
        </p>
        <p className="text-sm leading-6 text-[#53685d]">
          This summary reflects what Routinelle understood so far. You can edit
          any section before moving to a routine.
        </p>
      </div>

      {needsRoutineRegeneration ? (
        <div
          className="rounded-lg border border-[#d6c48d] bg-[#fff8e6] p-4"
          role="status"
        >
          <p className="text-sm font-semibold text-[#1f2a24]">
            Profile changed
          </p>
          <p className="mt-1 text-sm leading-6 text-[#53685d]">
            Based on your updated answers, the next routine should be
            regenerated before you rely on an earlier routine.
          </p>
        </div>
      ) : null}

      {saveState.status !== "idle" ? (
        <div
          className={cn(
            "rounded-lg border p-4 text-sm leading-6",
            saveState.status === "saved"
              ? "border-[#c8d2c7] bg-[#eef4ed] text-[#31463a]"
              : "border-[#d8d0c3] bg-[#fbfaf7] text-[#53685d]",
          )}
          role="status"
        >
          {saveState.message}
        </div>
      ) : null}

      <div className="grid gap-3">
        {summary.items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-[#d8d0c3] bg-[#fbfaf7] p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#1f2a24]">
                  {item.label}
                </p>
                <p className="text-sm leading-6 text-[#53685d]">{item.value}</p>
                {item.confidence === "unknown" ? (
                  <p className="text-xs font-semibold uppercase text-[#7a6846]">
                    Unknown answer
                  </p>
                ) : null}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => onEdit(item.id)}
                className="rounded-lg border-[#b9c4b8] bg-white/65 text-[#31463a] hover:bg-white"
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>

      <section className="space-y-3" aria-labelledby="routine-risk-flags">
        <h2 id="routine-risk-flags" className="text-lg font-semibold">
          Routine risk flags
        </h2>
        <div className="grid gap-3">
          {summary.riskFlags.map((flag) => (
            <div
              key={flag.id}
              className={cn(
                "rounded-lg border p-4",
                flag.tone === "caution"
                  ? "border-[#d6c48d] bg-[#fff8e6]"
                  : "border-[#c8d2c7] bg-[#eef4ed]",
              )}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#1f2a24]">
                    {flag.label}
                  </p>
                  <p className="text-sm leading-6 text-[#53685d]">
                    {flag.detail}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onEdit(flag.editQuestionId)}
                  className="rounded-lg border-[#b9c4b8] bg-white/65 text-[#31463a] hover:bg-white"
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function OnboardingFlow() {
  const [answers, setAnswers] = useState<OnboardingAnswers>(
    emptyOnboardingAnswers,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [completedAnswersKey, setCompletedAnswersKey] = useState<string | null>(
    null,
  );
  const [needsRoutineRegeneration, setNeedsRoutineRegeneration] =
    useState(false);
  const [profileSaveState, setProfileSaveState] = useState<ProfileSaveState>({
    status: "idle",
    message: null,
  });
  const [routineState, setRoutineState] = useState<RoutineGenerationState>({
    status: "idle",
  });
  const [routineSaveState, setRoutineSaveState] = useState<RoutineSaveState>({
    status: "idle",
    message: null,
  });
  const router = useRouter();

  const visibleQuestions = useMemo(() => getVisibleQuestions(answers), [answers]);
  const safeCurrentIndex = Math.min(currentIndex, visibleQuestions.length - 1);
  const currentQuestion = visibleQuestions[safeCurrentIndex];
  const currentQuestionTitleId = `onboarding-question-${currentQuestion.id}`;
  const isFirstQuestion = safeCurrentIndex === 0;
  const isLastQuestion = safeCurrentIndex === visibleQuestions.length - 1;
  const progressPercent = Math.round(
    ((safeCurrentIndex + 1) / visibleQuestions.length) * 100,
  );
  const answeredCount = useMemo(() => getAnswerCount(answers), [answers]);
  const currentConfidence = getOnboardingQuestionConfidence(
    answers,
    currentQuestion,
  );
  const summary = useMemo(() => buildSkinProfileSummary(answers), [answers]);

  async function persistProfileUpdate(
    nextAnswers: OnboardingAnswers,
    routineRegenerationRequired: boolean,
  ) {
    setProfileSaveState({
      status: "saving",
      message: "Saving profile updates...",
    });

    try {
      const response = await fetch("/api/profile/skin-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: nextAnswers,
          routineRegenerationRequired,
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: { code?: string; message?: string };
      };

      if (response.ok && payload.ok) {
        setProfileSaveState({
          status: "saved",
          message: routineRegenerationRequired
            ? "Profile updates are saved to your account. Regenerate the routine before using an older result."
            : "Profile is saved to your account.",
        });
        return;
      }

      if (payload.error?.code === "auth-required") {
        setProfileSaveState({
          status: "anonymous",
          message:
            "Profile updates are available in this session. Sign in later to save them to an account.",
        });
        return;
      }

      setProfileSaveState({
        status: "unavailable",
        message:
          payload.error?.message ??
          "Profile updates are available in this session, but account saving is unavailable right now.",
      });
    } catch {
      setProfileSaveState({
        status: "unavailable",
        message:
          "Profile updates are available in this session, but account saving is unavailable right now.",
      });
    }
  }

  async function generateRoutine() {
    setRoutineState({ status: "generating" });
    setRoutineSaveState({ status: "idle", message: null });

    try {
      const response = await fetch("/api/routines/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: answers }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        data?: { routine: GeneratedRoutine };
        error?: { message?: string };
      };

      if (response.ok && payload.ok && payload.data) {
        setRoutineState({ status: "ready", routine: payload.data.routine });
        return;
      }

      setRoutineState({
        status: "error",
        message: payload.error?.message ?? "Routine could not be generated.",
      });
    } catch {
      setRoutineState({
        status: "error",
        message: "Routine could not be generated.",
      });
    }
  }

  async function saveRoutine(routine: GeneratedRoutine) {
    setRoutineSaveState({ status: "saving", message: "Saving routine..." });

    try {
      const response = await fetch("/api/routines/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routine }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        data?: { routine: GeneratedRoutine };
        error?: { code?: string; message?: string };
      };

      if (response.ok && payload.ok && payload.data) {
        router.push(`/routines/${payload.data.routine.id}`);
        return;
      }

      if (payload.error?.code === "auth-required") {
        setRoutineSaveState({
          status: "auth-required",
          message: "Sign in to save this routine to your account.",
        });
        return;
      }

      setRoutineSaveState({
        status: "error",
        message: payload.error?.message ?? "Routine could not be saved.",
      });
    } catch {
      setRoutineSaveState({
        status: "error",
        message: "Routine could not be saved.",
      });
    }
  }

  function editQuestion(questionId: OnboardingQuestionId) {
    const nextIndex = getVisibleQuestions(answers).findIndex(
      (question) => question.id === questionId,
    );

    if (nextIndex >= 0) {
      setCurrentIndex(nextIndex);
      setError(null);
      setIsComplete(false);
      setProfileSaveState({ status: "idle", message: null });
      setRoutineState({ status: "idle" });
      setRoutineSaveState({ status: "idle", message: null });
    }
  }

  function selectSingle(value: OnboardingOptionValue) {
    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: value,
      ...(currentQuestion.id === "currentRoutineChoice" &&
      value !== "addBasics"
        ? { currentRoutineProductTypes: [] }
        : {}),
    }));
    setError(null);
    setIsComplete(false);
  }

  function toggleMulti(value: OnboardingOptionValue) {
    if (!isMultiQuestionId(currentQuestion.id)) {
      return;
    }

    setAnswers((current) => {
      const existing = current[currentQuestion.id] as OnboardingOptionValue[];
      const exclusiveValues = currentQuestion.exclusiveValues ?? [];
      const isExclusiveValue = exclusiveValues.includes(value);

      if (isExclusiveValue) {
        return {
          ...current,
          [currentQuestion.id]: existing.includes(value) ? [] : [value],
        };
      }

      const withoutExclusiveValues = existing.filter(
        (item) => !exclusiveValues.includes(item),
      );
      const isAlreadySelected = withoutExclusiveValues.includes(value);
      const maxSelections =
        currentQuestion.maxSelections ?? currentQuestion.options.length;
      const nextValues = isAlreadySelected
        ? withoutExclusiveValues.filter((item) => item !== value)
        : [...withoutExclusiveValues, value].slice(0, maxSelections);

      return {
        ...current,
        [currentQuestion.id]: nextValues,
      };
    });
    setError(null);
    setIsComplete(false);
  }

  function goBack() {
    setCurrentIndex((index) => Math.max(0, index - 1));
    setError(null);
    setIsComplete(false);
  }

  function continueFlow() {
    const validation = validateOnboardingQuestion(
      answers,
      currentQuestion.id,
    );

    if (!validation.ok) {
      setError(validation.errors[0]?.message ?? "Choose an answer to continue.");
      return;
    }

    if (!isLastQuestion) {
      setCurrentIndex((index) => index + 1);
      setError(null);
      setIsComplete(false);
      return;
    }

    const fullValidation = validateOnboardingAnswers(answers);
    if (!fullValidation.ok) {
      const firstError = fullValidation.errors[0];
      const errorIndex = visibleQuestions.findIndex(
        (question) => question.id === firstError?.questionId,
      );

      if (errorIndex >= 0) {
        setCurrentIndex(errorIndex);
      }

      setError(firstError?.message ?? "Choose an answer to continue.");
      setIsComplete(false);
      return;
    }

    const nextAnswersKey = getAnswersKey(answers);
    const routineRegenerationRequired =
      completedAnswersKey !== null && completedAnswersKey !== nextAnswersKey;

    setError(null);
    setIsComplete(true);
    setCompletedAnswersKey(nextAnswersKey);
    setNeedsRoutineRegeneration(routineRegenerationRequired);
    void persistProfileUpdate(answers, routineRegenerationRequired);
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-2xl flex-col px-4 py-6 text-[#1f2a24] sm:px-6">
      <nav
        aria-label="Onboarding navigation"
        className="flex items-center justify-between gap-4 text-sm"
      >
        <Link href="/" className="font-semibold">
          Routinelle
        </Link>
        <span className="text-right text-[#53685d]">
          {answeredCount} of {visibleQuestions.length} answered
        </span>
      </nav>

      <main
        id="main-content"
        className="flex flex-1 items-center py-8 sm:py-10"
      >
        <Card className="w-full rounded-lg border-[#d8d0c3] bg-white/90 shadow-none">
          <CardHeader className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm text-[#53685d]">
                <span>
                  Question {safeCurrentIndex + 1} of {visibleQuestions.length}
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div
                className="h-2 rounded-full bg-[#e4ddd2]"
                role="progressbar"
                aria-label="Onboarding progress"
                aria-valuemin={0}
                aria-valuemax={visibleQuestions.length}
                aria-valuenow={safeCurrentIndex + 1}
              >
                <div
                  className="h-full rounded-full bg-[#31463a]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <CardTitle
                id={currentQuestionTitleId}
                className="text-2xl leading-tight sm:text-3xl"
              >
                {isComplete ? "Review your skin profile" : currentQuestion.title}
              </CardTitle>
              <CardDescription className="text-base leading-7 text-[#53685d]">
                {isComplete
                  ? "Based on your answers, here is the profile context Routinelle will use next."
                  : currentQuestion.helper}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {isComplete ? (
              <div className="space-y-6">
                <SummarySection
                  summary={summary}
                  needsRoutineRegeneration={needsRoutineRegeneration}
                  saveState={profileSaveState}
                  onEdit={editQuestion}
                />

                {routineState.status === "ready" ? (
                  <div className="space-y-4 border-t border-[#d8d0c3] pt-6">
                    <RoutineView
                      routine={routineState.routine}
                      explanations={buildRoutineExplanationBundle(
                        routineState.routine,
                        answers,
                      )}
                    />
                    {routineState.routine.state !== "safety-blocked" ? (
                      <div className="space-y-3">
                        <Button
                          type="button"
                          onClick={() => saveRoutine(routineState.routine)}
                          disabled={routineSaveState.status === "saving"}
                          className="rounded-lg bg-[#31463a] text-white hover:bg-[#26372e]"
                        >
                          {routineSaveState.status === "saving"
                            ? "Saving..."
                            : "Save this routine"}
                        </Button>
                        {routineSaveState.message ? (
                          <p
                            className="text-sm leading-6 text-[#53685d]"
                            role="status"
                          >
                            {routineSaveState.message}
                            {routineSaveState.status === "auth-required" ? (
                              <>
                                {" "}
                                <Link
                                  href="/auth/login"
                                  className="font-semibold underline underline-offset-4"
                                >
                                  Sign in
                                </Link>
                              </>
                            ) : null}
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-3 border-t border-[#d8d0c3] pt-6">
                    <Button
                      type="button"
                      onClick={generateRoutine}
                      disabled={routineState.status === "generating"}
                      className="rounded-lg bg-[#31463a] text-white hover:bg-[#26372e]"
                    >
                      {routineState.status === "generating"
                        ? "Generating your routine..."
                        : "Generate my routine"}
                    </Button>
                    {routineState.status === "error" ? (
                      <p className="text-sm text-[#8a3b2f]" role="alert">
                        {routineState.message}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            ) : currentQuestion.kind === "single" ? (
              <div
                className="grid gap-3"
                role="radiogroup"
                aria-labelledby={currentQuestionTitleId}
              >
                {currentQuestion.options.map((option) => {
                  const selected = isSelected(
                    answers,
                    currentQuestion,
                    option.value,
                  );

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => selectSingle(option.value)}
                      className={cn(
                        "min-h-11 rounded-lg border border-[#d8d0c3] bg-[#fbfaf7] p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#31463a] focus-visible:ring-offset-2",
                        selected &&
                          "border-[#31463a] bg-[#eef4ed] text-[#1f2a24]",
                      )}
                    >
                      <span className="block text-sm font-semibold">
                        {option.label}
                      </span>
                      {option.helper ? (
                        <span className="mt-2 block text-sm leading-6 text-[#53685d]">
                          {option.helper}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div
                className="flex flex-wrap gap-3"
                role="group"
                aria-labelledby={currentQuestionTitleId}
              >
                {currentQuestion.options.map((option) => {
                  const selected = isSelected(
                    answers,
                    currentQuestion,
                    option.value,
                  );

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleMulti(option.value)}
                      className={cn(
                        "min-h-11 rounded-full border border-[#b9c4b8] bg-white px-4 py-2 text-sm font-semibold text-[#31463a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#31463a] focus-visible:ring-offset-2",
                        selected && "border-[#31463a] bg-[#eef4ed]",
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}

            {!isComplete && currentQuestion.kind === "multi" ? (
              <p className="text-sm leading-6 text-[#53685d]">
                {currentQuestion.selectionHelper}
              </p>
            ) : null}

            {!isComplete && error ? (
              <p className="text-sm text-[#8a3b2f]" role="alert">
                Error: {error}
              </p>
            ) : null}

            {!isComplete && currentConfidence === "unknown" ? (
              <p className="rounded-lg border border-[#d8d0c3] bg-[#fbfaf7] p-4 text-sm leading-6 text-[#53685d]">
                Not sure is fine. Routinelle will keep this answer as unknown
                instead of treating it as a firm skin signal.
              </p>
            ) : null}

            {!isComplete ? (
              <div className="flex flex-col-reverse gap-3 border-t border-[#d8d0c3] pt-5 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  disabled={isFirstQuestion}
                  className="rounded-lg border-[#b9c4b8] bg-white/65 text-[#31463a] hover:bg-white"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={continueFlow}
                  className="rounded-lg bg-[#31463a] text-white hover:bg-[#26372e]"
                >
                  {isLastQuestion ? "Review profile" : "Continue"}
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
