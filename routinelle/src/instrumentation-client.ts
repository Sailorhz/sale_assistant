// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a user loads a page in the
// browser. Next.js automatically loads this file (no import required).
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Health-adjacent data (skin-condition selections, safety-event context)
  // flows through this app's request bodies. Never send default PII, and
  // strip request data/cookies defense-in-depth even if this default is
  // ever accidentally flipped.
  sendDefaultPii: false,
  beforeSend(event) {
    if (event.request) {
      delete event.request.data;
      delete event.request.cookies;
    }
    return event;
  },

  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Deliberately no `integrations` array: this app's onboarding and
  // check-in forms collect skin-condition-adjacent health data via
  // radio/select inputs. Session Replay would visually capture those
  // selections even with default text-masking (masking targets free text,
  // not the semantic meaning of a selected radio option), and the Feedback
  // widget and auto console-breadcrumb Logs integration risk piping
  // sensitive data into Sentry without a code review catching it. PII
  // safety is the priority here, ahead of extra debugging features. Do
  // not add `Sentry.replayIntegration()`, `Sentry.feedbackIntegration()`,
  // or a console-logging integration without re-reviewing this posture.

  // No `tunnelRoute`: unnecessary complexity/attack surface at this scale.
});
