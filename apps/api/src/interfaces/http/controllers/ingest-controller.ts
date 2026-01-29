import { ingestEvent, IngestEventInput } from "../../../application/usecases/ingest-event";
import { EventBus } from "../../../application/ports/event-bus";
import { EventRepository } from "../../../application/ports/event-repository";

export function ingestController(bus: EventBus, repo: EventRepository, input: IngestEventInput) {
  return ingestEvent(bus, repo, input);
}
