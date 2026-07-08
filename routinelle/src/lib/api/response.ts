import { NextResponse } from "next/server";

import type { ApiErrorCode, ApiResult } from "@/lib/api/result";
import { err, ok } from "@/lib/api/result";

export function apiJson<TData>(
  result: ApiResult<TData>,
  status = 200,
  headers?: HeadersInit,
) {
  const response = NextResponse.json(result, { status });
  response.headers.set("Cache-Control", "no-store");

  if (headers) {
    new Headers(headers).forEach((value, key) => {
      response.headers.set(key, value);
    });
  }

  return response;
}

export function apiOk<TData>(data: TData, status = 200) {
  return apiJson(ok(data), status);
}

export function apiError(
  code: ApiErrorCode,
  message: string,
  status: number,
  issues?: unknown,
  headers?: HeadersInit,
) {
  return apiJson(err(code, message, issues), status, headers);
}
