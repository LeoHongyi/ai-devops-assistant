import { describe, it, expect } from "vitest";
import { processIngestMessage } from "../infrastructure/event-bus/nats-consumer";
import { EventRepository } from "../application/ports/event-repository";

class MemoryRepo implements EventRepository {
  created: unknown[] = [];
  async create(input: any) {
    this.created.push(input);
    return { id: "1", ...input } as any;
  }
}

describe("processIngestMessage", () => {
  it("writes event when tenantId exists", async () => {
    const repo = new MemoryRepo();
    await processIngestMessage(repo, {
      tenantId: "t1",
      source: "webhook",
      type: "event",
      payload: { a: 1 }
    });

    expect(repo.created.length).toBe(1);
  });
});
