import { connect, StringCodec } from "nats";
import { EventRepository } from "../../application/ports/event-repository";
import { IngestEventInput } from "../../application/usecases/ingest-event";

const sc = StringCodec();

export async function processIngestMessage(repo: EventRepository, payload: IngestEventInput) {
  if (!payload.tenantId) return;
  await repo.create({
    tenantId: payload.tenantId,
    serviceId: payload.serviceId ?? null,
    type: payload.type,
    severity: payload.severity ?? "info",
    source: payload.source,
    ts: new Date(),
    payload: payload.payload
  });
}

export async function startIngestConsumer(natsUrl: string, repo: EventRepository) {
  const nc = await connect({ servers: natsUrl });
  const sub = nc.subscribe("ingest.events");

  (async () => {
    for await (const m of sub) {
      try {
        const raw = sc.decode(m.data);
        const parsed = JSON.parse(raw) as IngestEventInput;
        await processIngestMessage(repo, parsed);
      } catch {
        // swallow parse/processing errors to keep consumer alive
      }
    }
  })();

  return nc;
}
