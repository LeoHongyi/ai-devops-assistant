import { PrismaClient } from "@prisma/client";
import { IncidentRepository } from "../../application/ports/incident-repository";
import { Incident } from "../../domain/incident";

export class PrismaIncidentRepository implements IncidentRepository {
  constructor(private prisma: PrismaClient) {}

  async list(tenantId: string): Promise<Incident[]> {
    return this.prisma.incident.findMany({ where: { tenantId } });
  }

  async getById(tenantId: string, id: string): Promise<Incident | null> {
    return this.prisma.incident.findFirst({ where: { tenantId, id } });
  }

  async create(tenantId: string, input: Omit<Incident, "id" | "tenantId" | "openedAt" | "status" | "closedAt">): Promise<Incident> {
    return this.prisma.incident.create({
      data: {
        tenantId,
        title: input.title,
        severity: input.severity,
        status: "open"
      }
    });
  }

  async close(tenantId: string, id: string): Promise<Incident | null> {
    return this.prisma.incident.update({
      where: { id },
      data: { status: "closed", closedAt: new Date() }
    }).catch(() => null);
  }
}
