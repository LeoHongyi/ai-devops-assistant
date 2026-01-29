import { describe, it, expect } from "vitest";
import { hasPermission, Permissions } from "../application/auth/permissions";

describe("hasPermission", () => {
  it("allows explicit permission", () => {
    expect(hasPermission([Permissions.IngestWrite], Permissions.IngestWrite)).toBe(true);
  });

  it("denies missing permission", () => {
    expect(hasPermission([], Permissions.IngestWrite)).toBe(false);
  });

  it("allows wildcard", () => {
    expect(hasPermission(["*"], Permissions.IngestWrite)).toBe(true);
  });
});
