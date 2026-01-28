import { ingestEvent, IngestEventInput } from "../../application/usecases/ingest-event";

export function ingestController(input: IngestEventInput) {
  return ingestEvent(input);
}
