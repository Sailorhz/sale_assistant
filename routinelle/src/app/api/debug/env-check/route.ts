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
    upstashUrl: describe("UPSTASH_REDIS_REST_URL"),
    upstashToken: describe("UPSTASH_REDIS_REST_TOKEN"),
  });
}
