import { describe, it, expect } from "vitest";
import { ingestEvent } from "../application/usecases/ingest-event";
import { EventBus } from "../application/ports/event-bus";
import { EventRepository } from "../application/ports/event-repository";

class MemoryBus implements EventBus {
  published: Array<{ subject: string; payload: unknown }> = [];
  async publish(subject: string, payload: unknown) {
    this.published.push({ subject, payload });
  }
}

class MemoryRepo implements EventRepository {
  created: unknown[] = [];
  async create(input: any) {
    this.created.push(input);
    return { id: "1", ...input } as any;
  }
}

describe("ingestEvent", () => {
  it("creates event and publishes message", async () => {
    const bus = new MemoryBus();
    const repo = new MemoryRepo();

    const result = await ingestEvent(bus, repo, {
      tenantId: "t1",
      source: "webhook",
      type: "event",
      payload: { a: 1 }
    });

    expect(result.ok).toBe(true);
    expect(repo.created.length).toBe(1);
    expect(bus.published.length).toBe(1);
  });
});
