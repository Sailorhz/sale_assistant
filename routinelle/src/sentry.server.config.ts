// This file configures the initialization of Sentry on the server side.
// The config you add here will be used whenever a server-side process
// handles a request.
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
});
