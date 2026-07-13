"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { onboardingQuestions } from "@/lib/domain/onboarding";
import {
  PHOTO_ANALYSIS_CONSENT_CHECKBOX_LABEL,
  PHOTO_ANALYSIS_CONSENT_COPY,
} from "@/lib/domain/photo-analysis-consent";
import type { PhotoAnalysisResult } from "@/lib/domain/photo-analysis";
import { resizeImageForAnalysis } from "@/lib/client/image-resize";

type PhotoStepState =
  | { phase: "choice" }
  | { phase: "captured"; file: File; previewUrl: string; consentGranted: boolean }
  | { phase: "analyzing"; previewUrl: string }
  | { phase: "result"; result: PhotoAnalysisResult; previewUrl: string }
  | { phase: "error"; message: string; previewUrl: string | null };

function optionLabel(questionId: "skinType" | "concerns", value: string) {
  const question = onboardingQuestions.find((item) => item.id === questionId);
  return question?.options.find((option) => option.value === value)?.label ?? value;
}

export function PhotoSuggestionStep({
  onAccept,
  onSkip,
}: {
  onAccept: (suggestion: { skinType?: string; concerns?: string[] }) => void;
  onSkip: () => void;
}) {
  const [state, setState] = useState<PhotoStepState>({ phase: "choice" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  function revokePreview(previewUrl: string | null | undefined) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  }

  function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setState({ phase: "captured", file, previewUrl, consentGranted: false });
  }

  function resetToChoice() {
    if (state.phase === "captured" || state.phase === "analyzing") {
      revokePreview("previewUrl" in state ? state.previewUrl : null);
    }
    if (state.phase === "result" || state.phase === "error") {
      revokePreview(state.previewUrl);
    }
    setState({ phase: "choice" });
  }

  async function analyzePhoto() {
    if (state.phase !== "captured" || !state.consentGranted) {
      return;
    }

    const { file, previewUrl } = state;
    setState({ phase: "analyzing", previewUrl });

    try {
      const { base64, mediaType } = await resizeImageForAnalysis(file);
      const response = await fetch("/api/onboarding/photo-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64,
          mediaType,
          consent: { granted: true },
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        data?: PhotoAnalysisResult;
        error?: { message?: string };
      };

      if (response.ok && payload.ok && payload.data) {
        setState({ phase: "result", result: payload.data, previewUrl });
        return;
      }

      setState({
        phase: "error",
        message:
          payload.error?.message ??
          "Photo analysis is unavailable right now. You can continue by answering the questions instead.",
        previewUrl,
      });
    } catch {
      setState({
        phase: "error",
        message:
          "Photo analysis is unavailable right now. You can continue by answering the questions instead.",
        previewUrl,
      });
    }
  }

  function handleAccept() {
    if (state.phase !== "result" || state.result.outcome !== "analyzed") {
      return;
    }

    revokePreview(state.previewUrl);
    onAccept({ skinType: state.result.skinType, concerns: state.result.concerns });
  }

  function handleSkip() {
    if (state.phase === "captured" || state.phase === "analyzing") {
      revokePreview("previewUrl" in state ? state.previewUrl : null);
    }
    if (state.phase === "result" || state.phase === "error") {
      revokePreview(state.previewUrl);
    }
    onSkip();
  }

  return (
    <Card className="w-full rounded-lg border-[#d8d0c3] bg-white/90 shadow-none">
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl leading-tight sm:text-3xl">
          Want a photo shortcut?
        </CardTitle>
        <CardDescription className="text-base leading-7 text-[#53685d]">
          Optionally use a photo to suggest your skin type -- you will still
          review it (and every other answer) before continuing.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {state.phase === "choice" ? (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileSelected}
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-lg bg-[#31463a] text-white hover:bg-[#26372e]"
            >
              Take or upload a photo
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onSkip}
              className="w-full rounded-lg border-[#b9c4b8] bg-white/65 text-[#31463a] hover:bg-white"
            >
              Skip, I&apos;ll answer questions
            </Button>
          </div>
        ) : null}

        {state.phase === "captured" ? (
          <div className="space-y-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- transient local preview, never uploaded as-is */}
            <img
              src={state.previewUrl}
              alt="Selected photo preview"
              className="max-h-64 w-full rounded-lg border border-[#d8d0c3] object-cover"
            />

            <div className="space-y-3 rounded-lg border border-[#d8d0c3] bg-[#fbfaf7] p-4">
              <p className="text-sm leading-6 text-[#53685d]">
                {PHOTO_ANALYSIS_CONSENT_COPY}
              </p>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="photo-analysis-consent"
                  checked={state.consentGranted}
                  onCheckedChange={(checked) =>
                    setState((current) =>
                      current.phase === "captured"
                        ? { ...current, consentGranted: checked === true }
                        : current,
                    )
                  }
                />
                <Label htmlFor="photo-analysis-consent" className="text-sm leading-6">
                  {PHOTO_ANALYSIS_CONSENT_CHECKBOX_LABEL}
                </Label>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={resetToChoice}
                className="rounded-lg border-[#b9c4b8] bg-white/65 text-[#31463a] hover:bg-white"
              >
                Choose a different photo
              </Button>
              <Button
                type="button"
                onClick={analyzePhoto}
                disabled={!state.consentGranted}
                className="rounded-lg bg-[#31463a] text-white hover:bg-[#26372e]"
              >
                Analyze this photo
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              className="w-full rounded-lg border-[#b9c4b8] bg-white/65 text-[#31463a] hover:bg-white"
            >
              Skip and answer manually instead
            </Button>
          </div>
        ) : null}

        {state.phase === "analyzing" ? (
          <p className="text-sm leading-6 text-[#53685d]" role="status">
            Analyzing your photo...
          </p>
        ) : null}

        {state.phase === "result" ? (
          <div className="space-y-4">
            <p className="text-sm leading-6 text-[#53685d]" role="status">
              {state.result.message}
            </p>

            {state.result.outcome === "analyzed" ? (
              <div className="rounded-lg border border-[#d8d0c3] bg-[#fbfaf7] p-4">
                {state.result.skinType ? (
                  <p className="text-sm leading-6">
                    <span className="font-semibold">Suggested skin type: </span>
                    {optionLabel("skinType", state.result.skinType)}
                  </p>
                ) : null}
                {state.result.concerns && state.result.concerns.length > 0 ? (
                  <p className="mt-2 text-sm leading-6">
                    <span className="font-semibold">Suggested concerns: </span>
                    {state.result.concerns
                      .map((concern) => optionLabel("concerns", concern))
                      .join(", ")}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={resetToChoice}
                className="rounded-lg border-[#b9c4b8] bg-white/65 text-[#31463a] hover:bg-white"
              >
                Try another photo
              </Button>
              {state.result.outcome === "analyzed" ? (
                <Button
                  type="button"
                  onClick={handleAccept}
                  className="rounded-lg bg-[#31463a] text-white hover:bg-[#26372e]"
                >
                  Use this suggestion
                </Button>
              ) : null}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              className="w-full rounded-lg border-[#b9c4b8] bg-white/65 text-[#31463a] hover:bg-white"
            >
              Skip and answer manually instead
            </Button>
          </div>
        ) : null}

        {state.phase === "error" ? (
          <div className="space-y-4">
            <p className="text-sm text-[#8a3b2f]" role="alert">
              {state.message}
            </p>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={resetToChoice}
                className="rounded-lg border-[#b9c4b8] bg-white/65 text-[#31463a] hover:bg-white"
              >
                Try another photo
              </Button>
              <Button
                type="button"
                onClick={handleSkip}
                className="rounded-lg bg-[#31463a] text-white hover:bg-[#26372e]"
              >
                Skip and answer manually instead
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
