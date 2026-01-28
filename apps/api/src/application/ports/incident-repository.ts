import { Incident } from "../../domain/incident";

export interface IncidentRepository {
  list(tenantId: string): Promise<Incident[]>;
  getById(tenantId: string, id: string): Promise<Incident | null>;
  create(tenantId: string, input: Omit<Incident, "id" | "tenantId" | "openedAt" | "status" | "closedAt">): Promise<Incident>;
  close(tenantId: string, id: string): Promise<Incident | null>;
}
