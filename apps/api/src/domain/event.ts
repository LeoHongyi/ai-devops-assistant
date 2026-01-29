export interface Event {
  id: string;
  tenantId: string;
  serviceId?: string | null;
  type: string;
  severity: string;
  source: string;
  ts: Date;
  payload: unknown;
}
