import { IncidentRepository } from "../../application/ports/incident-repository";
import { createIncident, CreateIncidentInput } from "../../application/usecases/create-incident";
import { listIncidents } from "../../application/usecases/list-incidents";
import { getIncident } from "../../application/usecases/get-incident";
import { closeIncident } from "../../application/usecases/close-incident";

export function createIncidentController(repo: IncidentRepository, tenantId: string, input: CreateIncidentInput) {
  return createIncident(repo, tenantId, input);
}

export function listIncidentsController(repo: IncidentRepository, tenantId: string) {
  return listIncidents(repo, tenantId);
}

export function getIncidentController(repo: IncidentRepository, tenantId: string, id: string) {
  return getIncident(repo, tenantId, id);
}

export function closeIncidentController(repo: IncidentRepository, tenantId: string, id: string) {
  return closeIncident(repo, tenantId, id);
}
