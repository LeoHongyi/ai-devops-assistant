import { IncidentRepository } from "../../application/ports/incident-repository";
import { Incident } from "../../domain/incident";

let idSeq = 1;

export class InMemoryIncidentRepository implements IncidentRepository {
  private incidents: Incident[] = [];

  async list() {
    return this.incidents;
  }

  async getById(id: string) {
    return this.incidents.find((i) => i.id === id) ?? null;
  }

  async create(input: Omit<Incident, "id" | "openedAt" | "status" | "closedAt">) {
    const incident: Incident = {
      id: String(idSeq++),
      title: input.title,
      severity: input.severity,
      status: "open",
      openedAt: new Date()
    };
    this.incidents.push(incident);
    return incident;
  }

  async close(id: string) {
    const incident = this.incidents.find((i) => i.id === id);
    if (!incident) return null;
    incident.status = "closed";
    incident.closedAt = new Date();
    return incident;
  }
}
