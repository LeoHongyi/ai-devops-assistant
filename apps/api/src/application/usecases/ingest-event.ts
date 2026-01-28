import { ok, Result } from "../result";

export interface IngestEventInput {
  source: string;
  type: string;
  payload: unknown;
}

export function ingestEvent(_input: IngestEventInput): Result<{ ok: true }> {
  return ok({ ok: true });
}
