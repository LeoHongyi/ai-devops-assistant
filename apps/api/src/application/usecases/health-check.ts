import { ok, Result } from "../result";

export function healthCheck(): Result<{ ok: true }> {
  return ok({ ok: true });
}
