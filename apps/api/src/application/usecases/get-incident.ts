import { IncidentRepository } from "../ports/incident-repository";
import { err, ok, Result, AppError } from "../result";
import { Incident } from "../../domain/incident";

export async function getIncident(repo: IncidentRepository, tenantId: string, id: string): Promise<Result<Incident>> {
  const item = await repo.getById(tenantId, id);
  if (!item) return err(new AppError("not_found"));
  return ok(item);
}
