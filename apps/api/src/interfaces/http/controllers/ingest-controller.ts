import { ingestEvent, IngestEventInput } from "../../../application/usecases/ingest-event";
import { EventBus } from "../../../application/ports/event-bus";

export function ingestController(bus: EventBus, input: IngestEventInput) {
  return ingestEvent(bus, input);
}
