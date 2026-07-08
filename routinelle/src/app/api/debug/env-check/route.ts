import { NextResponse } from "next/server";

function describe(name: string) {
  const value = process.env[name] ?? "";
  return {
    present: value.length > 0,
    length: value.length,
    prefix: value.slice(0, 20),
    suffix: value.slice(-6),
    hasWhitespace: /\s/.test(value),
  };
}

export async function GET() {
  return NextResponse.json({
    dsn: describe("NEXT_PUBLIC_SENTRY_DSN"),
    project: describe("SENTRY_PROJECT"),
    org: describe("SENTRY_ORG"),
    authToken: describe("SENTRY_AUTH_TOKEN"),
  });
}
