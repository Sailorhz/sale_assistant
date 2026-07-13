import Anthropic from "@anthropic-ai/sdk";

export const PHOTO_ANALYSIS_MODEL = "claude-haiku-4-5";

export const hasAnthropicEnvVars = Boolean(process.env.ANTHROPIC_API_KEY);

/**
 * Same "don't put the client in a global variable across Fluid-compute
 * invocations" caution as src/lib/supabase/server.ts, but this client holds
 * no per-request state (no cookies/session) so a module-level singleton is
 * safe here, matching src/lib/rate-limit.ts's getRedis() pattern.
 */
let client: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  return client;
}

export const PHOTO_ANALYSIS_SYSTEM_PROMPT = `You are a cosmetic skincare assistant helping suggest a starting skin-type
profile from a single photo. You are not a medical professional and must
never diagnose, name, or speculate about any medical condition.

Rules, in priority order:
1. If the image does not contain a clear, visible human face, respond with
   outcome "no_face_detected".
2. If you notice anything that reads as a clinical concern rather than a
   cosmetic one -- moles, lesions, wounds, unusual or asymmetric marks,
   anything that looks like it needs a dermatologist rather than a skincare
   routine -- respond with outcome "needs_professional_care" and do not
   attempt a cosmetic classification.
3. If the image is unusable for another reason (too dark, too blurry, not a
   photo of skin/a face at all), respond with outcome "unsupported_image".
4. Otherwise, respond with outcome "analyzed" and:
   - exactly one "skinType" value describing the overall visible impression
     (oiliness/dryness/balance across the face), and
   - zero to three "concerns" values for visibly apparent cosmetic concerns
     only (e.g. visible redness, visible blemishes, visible unevenness) --
     omit anything you cannot actually see.

Only ever describe cosmetic-visible characteristics. Never mention a medical
condition, never suggest a treatment, never comment on anything other than
what is visibly apparent in the photo. Respond only with the structured
output -- no additional commentary.`;

export type RawPhotoAnalysisResponse = {
  parsed: unknown;
  refused: boolean;
  model: string;
};

export async function callPhotoAnalysisModel(
  imageBase64: string,
  mediaType: "image/jpeg" | "image/png" | "image/webp",
  schema: ReturnType<typeof import("@/lib/vision/photo-analysis-schema").buildPhotoAnalysisJsonSchema>,
): Promise<RawPhotoAnalysisResponse> {
  const anthropic = getAnthropicClient();

  const response = await anthropic.messages.create(
    {
      model: PHOTO_ANALYSIS_MODEL,
      max_tokens: 400,
      system: PHOTO_ANALYSIS_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: imageBase64 },
            },
            {
              type: "text",
              text: "Classify this photo per your instructions.",
            },
          ],
        },
      ],
      // @ts-expect-error -- output_config/structured JSON output is a newer
      // API surface than this SDK version's shipped type definitions cover;
      // verify against the live API during the step-0 eval before relying
      // on this, per the plan's flagged open item.
      output_config: { format: { type: "json_schema", schema: schema.schema, name: schema.name } },
    },
    { timeout: 15_000 },
  );

  if (response.stop_reason === ("refusal" as typeof response.stop_reason)) {
    return { parsed: null, refused: true, model: response.model };
  }

  const textBlock = response.content.find((block) => block.type === "text");
  let parsed: unknown = null;

  if (textBlock && "text" in textBlock) {
    try {
      parsed = JSON.parse(textBlock.text);
    } catch {
      parsed = null;
    }
  }

  return { parsed, refused: false, model: response.model };
}
