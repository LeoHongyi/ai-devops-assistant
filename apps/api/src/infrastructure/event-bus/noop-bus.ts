import { EventBus } from "../../application/ports/event-bus";

export class NoopBus implements EventBus {
  async publish(_subject: string, _payload: unknown): Promise<void> {
    // no-op
  }
}
