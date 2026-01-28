import { IncidentRepository } from "../ports/incident-repository";
import { ok, Result } from "../result";
import { Incident } from "../../domain/incident";

export interface CreateIncidentInput {
  title: string;
  severity: "low" | "medium" | "high" | "critical";
}

export async function createIncident(
  repo: IncidentRepository,
  tenantId: string,
  input: CreateIncidentInput
): Promise<Result<Incident>> {
  const item = await repo.create(tenantId, input);
  return ok(item);
}
