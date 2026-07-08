import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  cacheComponents: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Only print logs for uploading source maps in CI.
  silent: !process.env.CI,

  // Upload a larger set of source maps for prettier stack traces (increases
  // build time). This (and the source-map upload step in general) is a
  // no-op — not a failure — when authToken/org/project are absent, e.g.
  // local development without Sentry env vars configured.
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in
  // breadcrumbs.
  reactComponentAnnotation: {
    enabled: true,
  },

  // Tree-shake Sentry logger statements to reduce bundle size.
  disableLogger: true,
});
