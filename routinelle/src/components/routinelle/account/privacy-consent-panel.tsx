"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  mvpPermissionBoundaries,
  recommendationDataUseSummary,
  type PrivacyConsent,
  type RecommendationDataUseItem,
} from "@/lib/domain/privacy-consent";

type PrivacyConsentPayload = {
  consent: PrivacyConsent;
  dataUseSummary: RecommendationDataUseItem[];
  permissionBoundaries: string[];
};

type ApiResponse =
  | {
      ok: true;
      data: PrivacyConsentPayload;
    }
  | {
      ok: false;
      error: {
        code: string;
        message: string;
      };
    };

type ConsentFormState = {
  profileRoutineStorageConsent: boolean;
  outcomeTrackingConsent: boolean;
};

export function PrivacyConsentPanel() {
  const [payload, setPayload] = useState<PrivacyConsentPayload | null>(null);
  const [formState, setFormState] = useState<ConsentFormState>({
    profileRoutineStorageConsent: false,
    outcomeTrackingConsent: false,
  });
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadConsent() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/account/privacy-consent", {
          cache: "no-store",
        });
        const result = (await response.json()) as ApiResponse;

        if (!isMounted) {
          return;
        }

        if (!result.ok) {
          setError(result.error.message);
          return;
        }

        setPayload(result.data);
        setFormState({
          profileRoutineStorageConsent:
            result.data.consent.profileRoutineStorageConsent,
          outcomeTrackingConsent: result.data.consent.outcomeTrackingConsent,
        });
      } catch {
        if (isMounted) {
          setError("Privacy consent could not be loaded right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadConsent();

    return () => {
      isMounted = false;
    };
  }, []);

  async function saveConsent() {
    setIsSaving(true);
    setStatus(null);
    setError(null);

    try {
      const response = await fetch("/api/account/privacy-consent", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });
      const result = (await response.json()) as ApiResponse;

      if (!result.ok) {
        setError(result.error.message);
        return;
      }

      setPayload(result.data);
      setStatus("Privacy choices saved.");
    } catch {
      setError("Privacy choices could not be saved right now.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="rounded-lg border-[#d8d0c3] bg-white/85 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Privacy and data use</CardTitle>
        <CardDescription className="leading-6">
          Choose whether Routinelle can store account data to save your routine
          and improve future guidance. You can change this later.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3" aria-labelledby="data-use-title">
          <h2 id="data-use-title" className="text-base font-semibold">
            What recommendation data means
          </h2>
          <div className="grid gap-3">
            {(payload?.dataUseSummary ?? recommendationDataUseSummary).map(
              (item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-[#d8d0c3] bg-[#fbfaf7] p-4"
                >
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-[#53685d]">
                    {item.detail}
                  </p>
                </div>
              ),
            )}
            {isLoading ? (
              <p className="text-sm text-[#53685d]">Loading privacy details.</p>
            ) : null}
          </div>
        </section>

        <section className="space-y-3" aria-labelledby="permissions-title">
          <h2 id="permissions-title" className="text-base font-semibold">
            MVP permissions
          </h2>
          <ul className="space-y-2 text-sm leading-6 text-[#53685d]">
            {(payload?.permissionBoundaries ?? mvpPermissionBoundaries).map(
              (boundary) => (
                <li key={boundary}>{boundary}</li>
              ),
            )}
          </ul>
        </section>

        <section className="space-y-4" aria-labelledby="consent-title">
          <h2 id="consent-title" className="text-base font-semibold">
            Your consent choices
          </h2>
          <div className="space-y-4 rounded-lg border border-[#d8d0c3] bg-[#fbfaf7] p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="profile-routine-storage-consent"
                checked={formState.profileRoutineStorageConsent}
                onCheckedChange={(checked) =>
                  setFormState((current) => ({
                    ...current,
                    profileRoutineStorageConsent: checked === true,
                  }))
                }
              />
              <div className="space-y-1">
                <Label htmlFor="profile-routine-storage-consent">
                  Store my profile and routine for account use
                </Label>
                <p className="text-sm leading-6 text-[#53685d]">
                  This lets Routinelle show saved guidance after you sign in.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="outcome-tracking-consent"
                checked={formState.outcomeTrackingConsent}
                onCheckedChange={(checked) =>
                  setFormState((current) => ({
                    ...current,
                    outcomeTrackingConsent: checked === true,
                  }))
                }
              />
              <div className="space-y-1">
                <Label htmlFor="outcome-tracking-consent">
                  Store future check-in outcomes
                </Label>
                <p className="text-sm leading-6 text-[#53685d]">
                  Optional check-ins can help update guidance if comfort,
                  irritation, or routine needs change.
                </p>
              </div>
            </div>
          </div>

          {payload ? (
            <p className="text-sm leading-6 text-[#53685d]">
              Current consent version: {payload.consent.consentVersion}.
              Last updated: {payload.consent.updatedAt ?? "not saved yet"}.
            </p>
          ) : null}

          {status ? (
            <p className="text-sm text-[#31463a]" role="status">
              Saved: {status}
            </p>
          ) : null}
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              Error: {error}
            </p>
          ) : null}

          <Button
            type="button"
            onClick={saveConsent}
            disabled={isLoading || isSaving}
            className="min-h-11 rounded-lg bg-[#31463a] text-white hover:bg-[#26372e]"
          >
            {isSaving ? "Saving choices..." : "Save privacy choices"}
          </Button>
        </section>
      </CardContent>
    </Card>
  );
}
