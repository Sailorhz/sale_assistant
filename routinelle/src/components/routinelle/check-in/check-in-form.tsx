"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { ApiResult } from "@/lib/api/result";
import type { CheckInSymptomLevel, RoutineCheckInInput } from "@/lib/domain/check-in";

type Props = {
  routineId: string;
  stepIds: string[];
};

type CheckInState = Omit<RoutineCheckInInput, "routineId">;

const symptomOptions: { value: CheckInSymptomLevel; label: string }[] = [
  { value: "none", label: "None" },
  { value: "mild", label: "Mild" },
  { value: "moderate", label: "Moderate" },
  { value: "strong", label: "Strong" },
];

const changeOptions = [
  { value: "better", label: "Better" },
  { value: "same", label: "Same" },
  { value: "worse", label: "Worse" },
  { value: "not_sure", label: "Not sure" },
] as const;

export function CheckInForm({ routineId, stepIds }: Props) {
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<CheckInState>({
    adherenceByStep: Object.fromEntries(stepIds.map((id) => [id, true])),
    dryness: "none",
    redness: "none",
    burning: "none",
    acneChange: "same",
    hydration: "same",
    irritation: "none",
    suspectedProductDiscomfort: false,
    persistentOrWorsening: false,
  });

  function update<K extends keyof CheckInState>(key: K, value: CheckInState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit() {
    setIsSubmitting(true);
    setStatus(null);

    const response = await fetch("/api/check-ins/submit", {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        routineId,
        ...form,
      }),
    });
    const result = (await response.json()) as ApiResult<{
      guidance: string;
    }>;

    setStatus(result.ok ? result.data.guidance : result.error.message);
    setIsSubmitting(false);
  }

  return (
    <div className="rounded-lg border border-[#d8d0c3] bg-white p-4">
      <h2 className="text-lg font-semibold">7-day check-in</h2>
      <p className="mt-2 text-sm leading-6 text-[#53685d]">
        This short check-in records adherence and comfort signals without
        collecting free-text symptom details.
      </p>
      {status ? <p className="mt-3 text-sm text-[#53685d]">{status}</p> : null}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-[#31463a]">
          Dryness
          <select
            value={form.dryness}
            onChange={(event) => update("dryness", event.target.value as CheckInSymptomLevel)}
            className="mt-2 min-h-11 w-full rounded-md border border-[#d8d0c3] bg-white px-3 text-sm"
          >
            {symptomOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-[#31463a]">
          Redness
          <select
            value={form.redness}
            onChange={(event) => update("redness", event.target.value as CheckInSymptomLevel)}
            className="mt-2 min-h-11 w-full rounded-md border border-[#d8d0c3] bg-white px-3 text-sm"
          >
            {symptomOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-[#31463a]">
          Burning or stinging
          <select
            value={form.burning}
            onChange={(event) => update("burning", event.target.value as CheckInSymptomLevel)}
            className="mt-2 min-h-11 w-full rounded-md border border-[#d8d0c3] bg-white px-3 text-sm"
          >
            {symptomOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-[#31463a]">
          Irritation
          <select
            value={form.irritation}
            onChange={(event) => update("irritation", event.target.value as CheckInSymptomLevel)}
            className="mt-2 min-h-11 w-full rounded-md border border-[#d8d0c3] bg-white px-3 text-sm"
          >
            {symptomOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-[#31463a]">
          Acne change
          <select
            value={form.acneChange}
            onChange={(event) =>
              update("acneChange", event.target.value as CheckInState["acneChange"])
            }
            className="mt-2 min-h-11 w-full rounded-md border border-[#d8d0c3] bg-white px-3 text-sm"
          >
            {changeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-[#31463a]">
          Hydration
          <select
            value={form.hydration}
            onChange={(event) =>
              update("hydration", event.target.value as CheckInState["hydration"])
            }
            className="mt-2 min-h-11 w-full rounded-md border border-[#d8d0c3] bg-white px-3 text-sm"
          >
            {changeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-4 grid gap-3 text-sm text-[#31463a]">
        <label className="flex items-center gap-3">
          <Checkbox
            checked={form.suspectedProductDiscomfort}
            onCheckedChange={(checked) =>
              update("suspectedProductDiscomfort", checked === true)
            }
          />
          Suspect one product is causing discomfort
        </label>
        <label className="flex items-center gap-3">
          <Checkbox
            checked={form.persistentOrWorsening}
            onCheckedChange={(checked) => update("persistentOrWorsening", checked === true)}
          />
          Symptoms are persistent or worsening
        </label>
      </div>
      {stepIds.length > 0 ? (
        <div className="mt-4 grid gap-2 text-sm text-[#31463a]">
          <p className="font-medium">Steps used</p>
          {stepIds.map((stepId) => (
            <label key={stepId} className="flex items-center gap-3">
              <Checkbox
                checked={form.adherenceByStep[stepId] ?? false}
                onCheckedChange={(checked) =>
                  update("adherenceByStep", {
                    ...form.adherenceByStep,
                    [stepId]: checked === true,
                  })
                }
              />
              {stepId}
            </label>
          ))}
        </div>
      ) : null}
      <Button
        type="button"
        onClick={submit}
        disabled={isSubmitting}
        className="mt-4 rounded-lg bg-[#31463a] text-white hover:bg-[#26372e]"
      >
        {isSubmitting ? "Submitting" : "Submit simple check-in"}
      </Button>
    </div>
  );
}
