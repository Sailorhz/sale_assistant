"use client";

import type { GeneratedRoutine } from "@/lib/domain/routine";
import type { RoutineExplanationBundle } from "@/lib/domain/explanation";

function trackProductClick(routineId: string, productId: string) {
  void fetch("/api/product-actions/click", {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ routineId, productId, linkStatus: "available" }),
  });
}

export function RoutineView({
  routine,
  explanations,
}: {
  routine: GeneratedRoutine;
  explanations?: RoutineExplanationBundle;
}) {
  return (
    <section className="space-y-5" aria-labelledby="routine-title">
      <div className="space-y-2">
        <h1 id="routine-title" className="text-2xl font-semibold">
          Your starter routine
        </h1>
        <p className="text-sm leading-6 text-[#53685d]">
          Based on your answers, this routine is structured for display and
          auditability.
        </p>
      </div>

      {routine.safetyMessages.length > 0 ? (
        <div className="rounded-lg border border-[#d6c48d] bg-[#fff8e6] p-4 text-sm">
          {routine.safetyMessages.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      ) : null}

      {explanations?.gentleStartExplanation ? (
        <div className="rounded-lg border border-[#c8d2c7] bg-[#eef4ed] p-4 text-sm text-[#31463a]">
          {explanations.gentleStartExplanation}
        </div>
      ) : null}

      {explanations?.neutralityStatement ? (
        <p className="rounded-lg border border-[#d8d0c3] bg-white p-4 text-sm leading-6 text-[#53685d]">
          {explanations.neutralityStatement}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {routine.sections.map((section) => (
          <div
            key={section.id}
            className="rounded-lg border border-[#d8d0c3] bg-white p-4"
          >
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <div className="mt-4 grid gap-3">
              {section.steps.map((step) => (
                <div
                  key={step.id}
                  className="rounded-lg border border-[#e4ddd2] bg-[#fbfaf7] p-3"
                >
                  <p className="font-semibold">{step.title}</p>
                  <p className="mt-1 text-sm text-[#53685d]">
                    {step.frequency} · {step.state}
                  </p>
                  {explanations?.stepExplanations.find(
                    (item) => item.stepId === step.id,
                  ) ? (
                    <details className="mt-2 text-sm text-[#53685d]">
                      <summary className="cursor-pointer font-semibold text-[#31463a]">
                        Why this step
                      </summary>
                      <p className="mt-2">
                        {
                          explanations.stepExplanations.find(
                            (item) => item.stepId === step.id,
                          )?.detail
                        }
                      </p>
                    </details>
                  ) : null}
                  {step.noSafeMatchReason ? (
                    <p className="mt-2 text-sm text-[#7a6846]">
                      No safe match: {step.noSafeMatchReason}
                    </p>
                  ) : null}
                  <ul className="mt-2 space-y-1 text-sm text-[#53685d]">
                    {step.productOptions.map((option) => (
                      <li key={option.productId}>
                        {option.productUrl ? (
                          <a
                            href={option.productUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => trackProductClick(routine.id, option.productId)}
                            className="font-semibold text-[#31463a] underline underline-offset-4"
                          >
                            {option.brandName} {option.productName}
                          </a>
                        ) : (
                          <span>
                            {option.brandName} {option.productName}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  {step.cautions.length > 0 ? (
                    <div className="mt-2 rounded-md border border-[#d6c48d] bg-[#fff8e6] p-2 text-sm text-[#53685d]">
                      {step.cautions.map((caution) => (
                        <p key={caution}>{caution}</p>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
