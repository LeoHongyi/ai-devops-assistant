export type Result<T> = { ok: true; value: T } | { ok: false; error: AppError };

export type AppErrorCode = "invalid_request" | "not_found" | "internal_error";

export class AppError extends Error {
  constructor(public code: AppErrorCode, message?: string) {
    super(message ?? code);
  }
}

export function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function err<T = never>(error: AppError): Result<T> {
  return { ok: false, error };
}
