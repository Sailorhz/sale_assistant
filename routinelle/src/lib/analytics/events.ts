export type AnalyticsEventName =
  | "onboarding.started"
  | "onboarding.completed"
  | "routine.generated"
  | "routine.no_safe_match"
  | "routine.safety_blocked"
  | "routine.generation_failed"
  | "routine.saved"
  | "product.clicked"
  | "check_in.completed"
  | "safety.professional_care_triggered";

export type AnalyticsEvent = {
  eventName: AnalyticsEventName;
  payload: Record<string, string | number | boolean | null>;
};

const allowedEvents = new Set<AnalyticsEventName>([
  "onboarding.started",
  "onboarding.completed",
  "routine.generated",
  "routine.no_safe_match",
  "routine.safety_blocked",
  "routine.generation_failed",
  "routine.saved",
  "product.clicked",
  "check_in.completed",
  "safety.professional_care_triggered",
]);

const allowedPayloadKeys: Record<AnalyticsEventName, Set<string>> = {
  "onboarding.started": new Set(["source"]),
  "onboarding.completed": new Set(["skinType", "budget", "localMarket", "hasSeriousSignal"]),
  "routine.generated": new Set(["routineId", "routineState", "variant", "market"]),
  "routine.no_safe_match": new Set(["routineId", "market", "missingStep"]),
  "routine.safety_blocked": new Set(["routineId", "reason"]),
  "routine.generation_failed": new Set(["reason"]),
  "routine.saved": new Set(["routineId", "routineState"]),
  "product.clicked": new Set(["productId", "routineId", "linkStatus"]),
  "check_in.completed": new Set(["routineId", "seriousSignal", "adherenceRate"]),
  "safety.professional_care_triggered": new Set(["routineId", "category", "severity"]),
};

function sanitizeValue(value: unknown) {
  if (typeof value === "string") {
    return value.trim().slice(0, 96);
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "boolean" || value === null) {
    return value;
  }

  return undefined;
}

export function buildAnalyticsEvent(
  eventName: AnalyticsEventName,
  payload: Record<string, unknown>,
): AnalyticsEvent {
  if (!allowedEvents.has(eventName)) {
    throw new Error("Unsupported analytics event.");
  }

  return {
    eventName,
    payload: Object.fromEntries(
      Object.entries(payload)
        .filter(([key]) => allowedPayloadKeys[eventName].has(key))
        .map(([key, value]) => [key, sanitizeValue(value)] as const)
        .filter(
          (entry): entry is readonly [
            string,
            string | number | boolean | null,
          ] => entry[1] !== undefined,
        )
    ),
  };
}
