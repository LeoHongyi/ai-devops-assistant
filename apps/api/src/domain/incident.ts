export type IncidentStatus = "open" | "closed";

export interface Incident {
  id: string;
  tenantId: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  status: IncidentStatus;
  openedAt: Date;
  closedAt?: Date;
}
