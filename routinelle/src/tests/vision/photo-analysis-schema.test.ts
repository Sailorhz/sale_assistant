import { describe, expect, it } from "vitest";

import {
  buildPhotoAnalysisJsonSchema,
  parsePhotoAnalysisModelOutput,
} from "@/lib/vision/photo-analysis-schema";

describe("buildPhotoAnalysisJsonSchema", () => {
  it("derives skinType/concerns enums from onboardingQuestions, excluding unknown-confidence options", () => {
    const schema = buildPhotoAnalysisJsonSchema();
    const skinTypeEnum = schema.schema.properties.skinType.enum;
    const concernsEnum = schema.schema.properties.concerns.items.enum;

    expect(skinTypeEnum).toContain("oily");
    expect(skinTypeEnum).toContain("balanced");
    expect(skinTypeEnum).not.toContain("notSure");

    expect(concernsEnum).toContain("hydration");
    expect(concernsEnum).toContain("blemishes");
    expect(concernsEnum).not.toContain("notSure");
  });

  it("always requires outcome and includes every outcome value", () => {
    const schema = buildPhotoAnalysisJsonSchema();

    expect(schema.schema.required).toEqual(["outcome"]);
    expect(schema.schema.properties.outcome.enum).toEqual([
      "analyzed",
      "no_face_detected",
      "needs_professional_care",
      "unsupported_image",
      "declined",
    ]);
  });
});

describe("parsePhotoAnalysisModelOutput", () => {
  it("accepts a valid analyzed result", () => {
    const result = parsePhotoAnalysisModelOutput({
      outcome: "analyzed",
      skinType: "oilyCombination",
      concerns: ["blemishes", "hydration"],
    });

    expect(result).toEqual({
      outcome: "analyzed",
      skinType: "oilyCombination",
      concerns: ["blemishes", "hydration"],
    });
  });

  it("drops concern values not in the allowed set instead of failing the whole result", () => {
    const result = parsePhotoAnalysisModelOutput({
      outcome: "analyzed",
      skinType: "dry",
      concerns: ["hydration", "not-a-real-concern"],
    });

    expect(result).toEqual({ outcome: "analyzed", skinType: "dry", concerns: ["hydration"] });
  });

  it("rejects an analyzed result with an invalid skinType", () => {
    const result = parsePhotoAnalysisModelOutput({
      outcome: "analyzed",
      skinType: "not-a-real-skin-type",
      concerns: [],
    });

    expect(result).toBeNull();
  });

  it("rejects an analyzed result missing skinType entirely", () => {
    const result = parsePhotoAnalysisModelOutput({ outcome: "analyzed", concerns: [] });

    expect(result).toBeNull();
  });

  it("passes through non-analyzed outcomes without requiring skinType/concerns", () => {
    expect(parsePhotoAnalysisModelOutput({ outcome: "no_face_detected" })).toEqual({
      outcome: "no_face_detected",
    });
    expect(parsePhotoAnalysisModelOutput({ outcome: "needs_professional_care" })).toEqual({
      outcome: "needs_professional_care",
    });
  });

  it("rejects an unrecognized outcome value", () => {
    expect(parsePhotoAnalysisModelOutput({ outcome: "something_else" })).toBeNull();
  });

  it("rejects non-object input", () => {
    expect(parsePhotoAnalysisModelOutput(null)).toBeNull();
    expect(parsePhotoAnalysisModelOutput("analyzed")).toBeNull();
    expect(parsePhotoAnalysisModelOutput(undefined)).toBeNull();
  });
});
