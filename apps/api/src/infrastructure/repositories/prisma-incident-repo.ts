import { PrismaClient } from "@prisma/client";
import { IncidentRepository } from "../../application/ports/incident-repository";
import { Incident } from "../../domain/incident";

export class PrismaIncidentRepository implements IncidentRepository {
  constructor(private prisma: PrismaClient) {}

  private toIncident(input: { id: string; tenantId: string; title: string; severity: string; status: string; openedAt: Date; closedAt: Date | null }): Incident {
    return {
      ...input,
      closedAt: input.closedAt ?? undefined,
      severity: input.severity as Incident["severity"],
      status: input.status as Incident["status"]
    };
  }

  async list(tenantId: string): Promise<Incident[]> {
    const items = await this.prisma.incident.findMany({ where: { tenantId } });
    return items.map((i: { id: string; tenantId: string; title: string; severity: string; status: string; openedAt: Date; closedAt: Date | null }) => this.toIncident(i));
  }

  async getById(tenantId: string, id: string): Promise<Incident | null> {
    const item = await this.prisma.incident.findFirst({ where: { tenantId, id } });
    return item ? this.toIncident(item) : null;
  }

  async create(tenantId: string, input: Omit<Incident, "id" | "tenantId" | "openedAt" | "status" | "closedAt">): Promise<Incident> {
    const item = await this.prisma.incident.create({
      data: {
        tenantId,
        title: input.title,
        severity: input.severity,
        status: "open"
      }
    });
    return this.toIncident(item);
  }

  async close(tenantId: string, id: string): Promise<Incident | null> {
    const item = await this.prisma.incident.update({
      where: { id },
      data: { status: "closed", closedAt: new Date() }
    }).catch(() => null);
    return item ? this.toIncident(item) : null;
  }
}
