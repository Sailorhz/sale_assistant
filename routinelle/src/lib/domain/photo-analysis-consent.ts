/**
 * Deliberately separate from PRIVACY_CONSENT_VERSION (privacy-consent.ts) --
 * this is a distinct, contextual, point-of-collection consent for a
 * materially more sensitive data category (face/skin photos), not bundled
 * into the two account-page storage checkboxes.
 */
export const PHOTO_ANALYSIS_CONSENT_VERSION = "2026-07-13.photo-suggestion.v1";

export const PHOTO_ANALYSIS_CONSENT_COPY =
  "To suggest your skin type from a photo, Routinelle sends the photo to a " +
  "third-party vision AI service for one-time analysis. The photo itself is " +
  "never saved by Routinelle and won't appear in your account data -- only " +
  "the resulting skin type and concern suggestions come back, and you can " +
  "change them before continuing. This is optional; you can skip and answer " +
  "the questions yourself instead.";

export const PHOTO_ANALYSIS_CONSENT_CHECKBOX_LABEL =
  "I agree to send my photo for this one-time analysis.";
