"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PROFILE_DELETION_CONFIRMATION,
  buildAccountDataSummary,
  type AccountDataSummary,
} from "@/lib/domain/account-data";

type ApiResponse =
  | {
      ok: true;
      data: AccountDataSummary;
    }
  | {
      ok: false;
      error: {
        code: string;
        message: string;
      };
    };

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AccountDataPanel() {
  const fallbackSummary = buildAccountDataSummary(null);
  const [summary, setSummary] = useState<AccountDataSummary>(fallbackSummary);
  const [confirmation, setConfirmation] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadAccountData() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/account/profile-data", {
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

        setSummary(result.data);
      } catch {
        if (isMounted) {
          setError("Account data could not be loaded right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAccountData();

    return () => {
      isMounted = false;
    };
  }, []);

  async function requestDeletion() {
    setIsSubmitting(true);
    setStatus(null);
    setError(null);

    try {
      const response = await fetch("/api/account/profile-data", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ confirmation }),
      });
      const result = (await response.json()) as ApiResponse;

      if (!result.ok) {
        setError(result.error.message);
        return;
      }

      setSummary(result.data);
      setConfirmation("");
      setStatus("Profile data deletion requested.");
    } catch {
      setError("Profile data deletion could not be requested right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const deletionRequestedAt = summary.deletionRequest?.requestedAt;
  const canSubmit =
    confirmation === PROFILE_DELETION_CONFIRMATION && !isSubmitting;

  return (
    <Card className="rounded-lg border-[#d8d0c3] bg-white/85 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Account data</CardTitle>
        <CardDescription className="leading-6">
          View recommendation-related data categories and request profile data
          deletion when you no longer want Routinelle to keep account guidance
          data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3" aria-labelledby="account-data-title">
          <h2 id="account-data-title" className="text-base font-semibold">
            Stored recommendation data
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {summary.items.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-[#d8d0c3] bg-[#fbfaf7] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold">{item.label}</p>
                  <span className="shrink-0 rounded-full bg-[#e8efe9] px-2 py-1 text-xs font-semibold text-[#31463a]">
                    {item.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#53685d]">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
          {isLoading ? (
            <p className="text-sm text-[#53685d]">Loading account data.</p>
          ) : null}
        </section>

        <section className="space-y-3" aria-labelledby="photo-status-title">
          <h2 id="photo-status-title" className="text-base font-semibold">
            Photo status
          </h2>
          <p className="rounded-lg border border-[#d8d0c3] bg-[#fbfaf7] p-4 text-sm leading-6 text-[#53685d]">
            {summary.photoStorageStatus}
          </p>
        </section>

        <section className="space-y-4" aria-labelledby="deletion-title">
          <div className="space-y-2">
            <h2 id="deletion-title" className="text-base font-semibold">
              Request profile data deletion
            </h2>
            <p className="text-sm leading-6 text-[#53685d]">
              This records a deletion request for recommendation-related profile
              data and turns off account storage consent. Routinelle has not
              stored profile, routine, check-in, or photo data yet, but future
              profile-linked views must honor this request.
            </p>
          </div>

          {deletionRequestedAt ? (
            <p className="rounded-lg border border-[#d8d0c3] bg-[#fbfaf7] p-4 text-sm leading-6 text-[#53685d]">
              Deletion requested on {formatDate(deletionRequestedAt)}.
            </p>
          ) : (
            <div className="space-y-4 rounded-lg border border-[#d8d0c3] bg-[#fbfaf7] p-4">
              <div className="space-y-2">
                <Label htmlFor="profile-deletion-confirmation">
                  Type {PROFILE_DELETION_CONFIRMATION} to confirm
                </Label>
                <Input
                  id="profile-deletion-confirmation"
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  autoComplete="off"
                />
              </div>
              <Button
                type="button"
                onClick={requestDeletion}
                disabled={!canSubmit}
                className="rounded-lg bg-[#31463a] text-white hover:bg-[#26372e]"
              >
                {isSubmitting ? "Requesting deletion" : "Request deletion"}
              </Button>
            </div>
          )}
        </section>

        {status ? (
          <p className="text-sm text-[#31463a]" role="status">
            Requested: {status}
          </p>
        ) : null}
        {error ? (
          <p className="text-sm text-[#8a3b2f]" role="alert">
            Error: {error}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
