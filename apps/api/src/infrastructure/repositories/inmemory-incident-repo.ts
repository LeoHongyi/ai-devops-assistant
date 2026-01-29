import { IncidentRepository } from "../../application/ports/incident-repository";
import { Incident } from "../../domain/incident";

let idSeq = 1;

export class InMemoryIncidentRepository implements IncidentRepository {
  private incidents: Incident[] = [];

  async list(tenantId: string) {
    return this.incidents.filter((i) => i.tenantId === tenantId);
  }

  async getById(tenantId: string, id: string) {
    return this.incidents.find((i) => i.id === id && i.tenantId === tenantId) ?? null;
  }

  async create(tenantId: string, input: Omit<Incident, "id" | "tenantId" | "openedAt" | "status" | "closedAt">) {
    const incident: Incident = {
      id: String(idSeq++),
      tenantId,
      title: input.title,
      severity: input.severity,
      status: "open",
      openedAt: new Date()
    };
    this.incidents.push(incident);
    return incident;
  }

  async close(tenantId: string, id: string) {
    const incident = this.incidents.find((i) => i.id === id && i.tenantId === tenantId);
    if (!incident) return null;
    incident.status = "closed";
    incident.closedAt = new Date();
    return incident;
  }
}
