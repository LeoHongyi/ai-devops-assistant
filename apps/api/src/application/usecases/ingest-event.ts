import { ok, Result } from "../result";
import { EventBus } from "../ports/event-bus";

export interface IngestEventInput {
  source: string;
  type: string;
  payload: unknown;
  tenantId?: string;
}

export async function ingestEvent(bus: EventBus, input: IngestEventInput): Promise<Result<{ ok: true }>> {
  await bus.publish("ingest.events", input);
  return ok({ ok: true });
}
