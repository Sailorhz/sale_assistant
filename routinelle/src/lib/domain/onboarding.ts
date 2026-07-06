import type {
  AcneOilinessSignal,
  BudgetPreference,
  CurrentRoutineChoice,
  CurrentRoutineProductType,
  IrritationBarrierSignal,
  LocalMarket,
  OnboardingAnswers,
  SensitivityTendency,
  SeriousSymptomSignal,
  SkinConcern,
  SkinType,
} from "@/lib/domain/skin-profile";

export type OnboardingQuestionId = keyof OnboardingAnswers;

export type OnboardingQuestionKind = "single" | "multi";
export type OnboardingOptionConfidence = "answered" | "unknown";

export type OnboardingOptionValue =
  | SkinType
  | SkinConcern
  | SensitivityTendency
  | AcneOilinessSignal
  | IrritationBarrierSignal
  | SeriousSymptomSignal
  | CurrentRoutineChoice
  | CurrentRoutineProductType
  | BudgetPreference
  | LocalMarket;

export type OnboardingOption = {
  value: OnboardingOptionValue;
  label: string;
  helper?: string;
  confidence?: OnboardingOptionConfidence;
};

export type OnboardingQuestion = {
  id: OnboardingQuestionId;
  kind: OnboardingQuestionKind;
  title: string;
  helper: string;
  options: OnboardingOption[];
  maxSelections?: number;
  exclusiveValues?: OnboardingOptionValue[];
  selectionHelper?: string;
  showWhen?: (answers: OnboardingAnswers) => boolean;
};

export const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: "skinType",
    kind: "single",
    title: "How would you describe your skin most days?",
    helper: "Choose the closest match. You can adjust this later.",
    options: [
      {
        value: "oily",
        label: "Oily",
        helper: "Shine appears quickly across most of the face.",
      },
      {
        value: "oilyCombination",
        label: "Oily-combination",
        helper: "Oilier T-zone with cheeks that feel balanced or dry.",
      },
      {
        value: "balanced",
        label: "Balanced / medium",
        helper: "Neither very oily nor very dry most days.",
      },
      {
        value: "dryCombination",
        label: "Dry-combination",
        helper: "Dryer cheeks with some oil in the T-zone.",
      },
      {
        value: "dry",
        label: "Dry",
        helper: "Skin often feels tight or needs richer moisture.",
      },
      {
        value: "notSure",
        label: "Not sure",
        confidence: "unknown",
        helper: "Routinelle will keep the first routine flexible.",
      },
    ],
  },
  {
    id: "concerns",
    kind: "multi",
    title: "What would you like the routine to support?",
    helper: "Select up to three priorities so the first routine stays focused.",
    maxSelections: 3,
    exclusiveValues: ["notSure"],
    selectionHelper: "Select up to three. Choosing not sure clears other selections.",
    options: [
      { value: "hydration", label: "Hydration" },
      { value: "blemishes", label: "Blemishes" },
      { value: "poresOiliness", label: "Pores and oiliness" },
      { value: "darkSpotsUnevenTone", label: "Dark spots or uneven tone" },
      { value: "earlyAgingSupport", label: "Early aging support" },
      { value: "irritationRedness", label: "Irritation or redness" },
      { value: "notSure", label: "Not sure yet", confidence: "unknown" },
    ],
  },
  {
    id: "sensitivity",
    kind: "single",
    title: "How easily does your skin feel uncomfortable?",
    helper: "This helps Routinelle start gently when needed.",
    options: [
      { value: "rarelySensitive", label: "Rarely" },
      { value: "sometimesSensitive", label: "Sometimes" },
      { value: "oftenSensitive", label: "Often" },
      {
        value: "currentlyUncomfortable",
        label: "It feels uncomfortable now",
        helper: "We will keep the first guidance calm and simple.",
      },
      { value: "notSure", label: "Not sure", confidence: "unknown" },
    ],
  },
  {
    id: "acneOilinessSignals",
    kind: "multi",
    title: "Which acne or oiliness patterns should Routinelle consider?",
    helper:
      "These are cosmetic guidance signals for routine caution, not a medical diagnosis.",
    maxSelections: 4,
    exclusiveValues: ["none", "notSure"],
    selectionHelper: "Choose all that fit. Choosing none or not sure clears other selections.",
    options: [
      { value: "frequentBlemishes", label: "Frequent blemishes" },
      { value: "cloggedPores", label: "Clogged-looking pores" },
      { value: "excessShine", label: "Excess shine" },
      { value: "postBlemishMarks", label: "Marks after blemishes" },
      { value: "none", label: "None of these" },
      { value: "notSure", label: "Not sure", confidence: "unknown" },
    ],
  },
  {
    id: "irritationBarrierSignals",
    kind: "multi",
    title: "Which comfort signals happen with your skin?",
    helper:
      "Routinelle uses this to keep cosmetic routine guidance gentle when needed.",
    maxSelections: 5,
    exclusiveValues: ["none", "notSure"],
    selectionHelper: "Choose all that fit. Choosing none or not sure clears other selections.",
    options: [
      { value: "redness", label: "Redness" },
      { value: "stingingOrBurning", label: "Stinging or burning" },
      { value: "tightOrDry", label: "Tight or dry feeling" },
      { value: "flakingOrRough", label: "Flaking or rough texture" },
      {
        value: "recentStrongActives",
        label: "Recent strong actives felt too much",
      },
      { value: "none", label: "None of these" },
      { value: "notSure", label: "Not sure", confidence: "unknown" },
    ],
  },
  {
    id: "seriousSymptomSignals",
    kind: "multi",
    title: "Any signs that need extra caution?",
    helper:
      "Routinelle does not diagnose medical conditions. These answers help later safety guidance stay conservative.",
    maxSelections: 4,
    exclusiveValues: ["none"],
    selectionHelper: "Choose any that apply, or choose none of these.",
    options: [
      { value: "swelling", label: "Swelling" },
      { value: "painfulOrSpreading", label: "Painful or spreading discomfort" },
      { value: "nearEyesOrLips", label: "Around eyes or lips" },
      { value: "persistentOrWorsening", label: "Getting worse or not settling" },
      { value: "none", label: "None of these" },
    ],
  },
  {
    id: "currentRoutineChoice",
    kind: "single",
    title: "Would you like to add your current routine basics?",
    helper:
      "This is optional. It can help later conflict checks, but you can still get a starter routine if you skip.",
    options: [
      {
        value: "addBasics",
        label: "Add basics",
        helper: "Choose the types of products you currently use.",
      },
      {
        value: "skip",
        label: "Skip for now",
        helper: "Routinelle can still prepare a starter routine later.",
      },
      {
        value: "notSure",
        label: "Not sure",
        confidence: "unknown",
        helper: "Keep going without guessing.",
      },
    ],
  },
  {
    id: "currentRoutineProductTypes",
    kind: "multi",
    title: "Which product types are in your current routine?",
    helper:
      "Choose product types only. Brand names and exact products can come later.",
    maxSelections: 8,
    selectionHelper: "Choose all that apply.",
    showWhen: (answers) => answers.currentRoutineChoice === "addBasics",
    options: [
      { value: "cleanser", label: "Cleanser" },
      { value: "moisturizer", label: "Moisturizer" },
      { value: "sunscreen", label: "Sunscreen" },
      { value: "exfoliant", label: "Exfoliant" },
      { value: "retinoid", label: "Retinoid" },
      { value: "blemishActive", label: "Blemish active" },
      { value: "vitaminCBrightening", label: "Vitamin C or brightening" },
      { value: "other", label: "Other cosmetic product" },
    ],
  },
  {
    id: "budget",
    kind: "single",
    title: "What budget should Routinelle respect?",
    helper: "This guides future product matching without changing your skin priorities.",
    options: [
      { value: "low", label: "Low" },
      { value: "moderate", label: "Moderate" },
      { value: "flexible", label: "Flexible" },
      { value: "notSure", label: "Not sure", confidence: "unknown" },
    ],
  },
  {
    id: "localMarket",
    kind: "single",
    title: "Where should products be easy to find?",
    helper: "For MVP, this helps prepare local availability rules later.",
    options: [
      { value: "france", label: "France" },
      { value: "eu", label: "Other EU market" },
      { value: "uk", label: "UK" },
      { value: "us", label: "US" },
      { value: "other", label: "Other market" },
      { value: "notSure", label: "Not sure", confidence: "unknown" },
    ],
  },
];

export function getQuestionPosition(questionId: OnboardingQuestionId) {
  return onboardingQuestions.findIndex((question) => question.id === questionId);
}
