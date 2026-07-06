export type CheckInSymptomLevel = "none" | "mild" | "moderate" | "strong";

export type RoutineCheckInInput = {
  routineId: string;
  adherenceByStep: Record<string, boolean>;
  dryness: CheckInSymptomLevel;
  redness: CheckInSymptomLevel;
  burning: CheckInSymptomLevel;
  acneChange: "better" | "same" | "worse" | "not_sure";
  hydration: "better" | "same" | "worse" | "not_sure";
  irritation: CheckInSymptomLevel;
  suspectedProductDiscomfort: boolean;
  persistentOrWorsening: boolean;
};

export type CheckInOutcomeSummary = {
  adherenceRate: number;
  hasMildDiscomfort: boolean;
  hasSeriousSignal: boolean;
  profileSignalUpdates: string[];
  userSummary: string;
};

export function summarizeCheckInOutcome(
  input: RoutineCheckInInput,
): CheckInOutcomeSummary {
  const adherenceValues = Object.values(input.adherenceByStep);
  const adherenceRate =
    adherenceValues.length === 0
      ? 0
      : adherenceValues.filter(Boolean).length / adherenceValues.length;
  const strongSignals = [input.burning, input.irritation, input.redness].some(
    (level) => level === "strong",
  );
  const hasSeriousSignal = strongSignals || input.persistentOrWorsening;
  const hasMildDiscomfort =
    !hasSeriousSignal &&
    [input.dryness, input.redness, input.burning, input.irritation].some(
      (level) => level === "mild" || level === "moderate",
    );
  const profileSignalUpdates = [
    input.hydration === "worse" ? "hydration-support-needed" : null,
    input.acneChange === "worse" ? "blemish-support-needed" : null,
    hasMildDiscomfort ? "comfort-caution" : null,
    hasSeriousSignal ? "professional-care-guidance" : null,
  ].filter((item): item is string => Boolean(item));

  return {
    adherenceRate,
    hasMildDiscomfort,
    hasSeriousSignal,
    profileSignalUpdates,
    userSummary: hasSeriousSignal
      ? "Your check-in suggests pausing product changes and seeking professional care."
      : hasMildDiscomfort
        ? "Your check-in suggests simplifying or choosing gentler options."
        : "Your check-in does not show a major comfort concern.",
  };
}

export function adjustedGuidanceFromCheckIn(summary: CheckInOutcomeSummary) {
  if (summary.hasSeriousSignal) {
    return "Pause routine changes and seek professional care before adding products.";
  }

  if (summary.hasMildDiscomfort) {
    return "Keep the routine simple, reduce optional support steps, and prefer gentler eligible alternatives when available.";
  }

  return "Continue the routine and reassess at the next check-in.";
}
