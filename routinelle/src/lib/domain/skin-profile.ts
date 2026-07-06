export type SkinType =
  | "oily"
  | "oilyCombination"
  | "balanced"
  | "dryCombination"
  | "dry"
  | "notSure";

export type SkinConcern =
  | "hydration"
  | "blemishes"
  | "poresOiliness"
  | "darkSpotsUnevenTone"
  | "earlyAgingSupport"
  | "irritationRedness"
  | "notSure";

export type SensitivityTendency =
  | "rarelySensitive"
  | "sometimesSensitive"
  | "oftenSensitive"
  | "currentlyUncomfortable"
  | "notSure";

export type BudgetPreference = "low" | "moderate" | "flexible" | "notSure";

export type LocalMarket = "france" | "eu" | "uk" | "us" | "other" | "notSure";

export type AcneOilinessSignal =
  | "frequentBlemishes"
  | "cloggedPores"
  | "excessShine"
  | "postBlemishMarks"
  | "none"
  | "notSure";

export type IrritationBarrierSignal =
  | "redness"
  | "stingingOrBurning"
  | "tightOrDry"
  | "flakingOrRough"
  | "recentStrongActives"
  | "none"
  | "notSure";

export type SeriousSymptomSignal =
  | "swelling"
  | "painfulOrSpreading"
  | "nearEyesOrLips"
  | "persistentOrWorsening"
  | "none";

export type CurrentRoutineChoice = "addBasics" | "skip" | "notSure";

export type CurrentRoutineProductType =
  | "cleanser"
  | "moisturizer"
  | "sunscreen"
  | "exfoliant"
  | "retinoid"
  | "blemishActive"
  | "vitaminCBrightening"
  | "other";

export type OnboardingAnswers = {
  skinType: SkinType | null;
  concerns: SkinConcern[];
  sensitivity: SensitivityTendency | null;
  acneOilinessSignals: AcneOilinessSignal[];
  irritationBarrierSignals: IrritationBarrierSignal[];
  seriousSymptomSignals: SeriousSymptomSignal[];
  currentRoutineChoice: CurrentRoutineChoice | null;
  currentRoutineProductTypes: CurrentRoutineProductType[];
  budget: BudgetPreference | null;
  localMarket: LocalMarket | null;
};

export const emptyOnboardingAnswers: OnboardingAnswers = {
  skinType: null,
  concerns: [],
  sensitivity: null,
  acneOilinessSignals: [],
  irritationBarrierSignals: [],
  seriousSymptomSignals: [],
  currentRoutineChoice: null,
  currentRoutineProductTypes: [],
  budget: null,
  localMarket: null,
};
