export const Permissions = {
  IngestWrite: "ingest:write",
  IncidentsRead: "incidents:read",
  IncidentsWrite: "incidents:write"
} as const;

export type PermissionKey = (typeof Permissions)[keyof typeof Permissions];

export function hasPermission(perms: string[], required: PermissionKey): boolean {
  return perms.includes(required) || perms.includes("*");
}
