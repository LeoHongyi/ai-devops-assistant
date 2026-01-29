import { PrismaClient } from "@prisma/client";
import { EventRepository } from "../../application/ports/event-repository";
import { Event } from "../../domain/event";

export class PrismaEventRepository implements EventRepository {
  constructor(private prisma: PrismaClient) {}

  async create(input: Omit<Event, "id">): Promise<Event> {
    return this.prisma.event.create({
      data: {
        tenantId: input.tenantId,
        serviceId: input.serviceId ?? null,
        type: input.type,
        severity: input.severity,
        source: input.source,
        ts: input.ts,
        payload: input.payload ?? {}
      }
    });
  }
}
