import { IncidentRepository } from "../ports/incident-repository";
import { ok, Result } from "../result";
import { Incident } from "../../domain/incident";

export async function listIncidents(repo: IncidentRepository, tenantId: string): Promise<Result<Incident[]>> {
  const items = await repo.list(tenantId);
  return ok(items);
}
