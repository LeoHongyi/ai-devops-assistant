import { ok, Result, err, AppError } from "../result";
import { EventBus } from "../ports/event-bus";
import { EventRepository } from "../ports/event-repository";

export interface IngestEventInput {
  tenantId?: string;
  source: string;
  type: string;
  payload: unknown;
  severity?: string;
  serviceId?: string;
}

export async function ingestEvent(
  bus: EventBus,
  repo: EventRepository,
  input: IngestEventInput
): Promise<Result<{ ok: true }>> {
  if (!input.tenantId) return err(new AppError("invalid_request"));

  await repo.create({
    tenantId: input.tenantId,
    serviceId: input.serviceId ?? null,
    type: input.type,
    severity: input.severity ?? "info",
    source: input.source,
    ts: new Date(),
    payload: input.payload
  });

  await bus.publish("ingest.events", input);
  return ok({ ok: true });
}
