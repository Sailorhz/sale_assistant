export type ApiErrorCode =
  | "auth-required"
  | "catalog-unavailable"
  | "permission-denied"
  | "validation"
  | "system-error"
  | "rate-limited";

export type ApiError = {
  code: ApiErrorCode;
  message: string;
  issues?: unknown;
};

export type ApiResult<TData> =
  | {
      ok: true;
      data: TData;
    }
  | {
      ok: false;
      error: ApiError;
    };

export function ok<TData>(data: TData): ApiResult<TData> {
  return { ok: true, data };
}

export function err(
  code: ApiErrorCode,
  message: string,
  issues?: unknown,
): ApiResult<never> {
  return {
    ok: false,
    error: {
      code,
      message,
      issues,
    },
  };
}
