"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// Next.js App Router's required top-level error boundary: it catches errors
// thrown in the root layout itself, so it must render its own <html>/<body>
// tags (it replaces the root layout when it renders) and must not import
// components that could themselves error — no ThemeProvider, no shared UI.
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          color: "#111",
          background: "#fff",
        }}
      >
        <div style={{ maxWidth: 420, padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 20, marginBottom: 8 }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 14, color: "#555", marginBottom: 20 }}>
            We hit an unexpected error and our team has been notified. Please
            try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "8px 16px",
              fontSize: 14,
              border: "1px solid #111",
              borderRadius: 6,
              background: "#111",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Refresh
          </button>
        </div>
      </body>
    </html>
  );
}
