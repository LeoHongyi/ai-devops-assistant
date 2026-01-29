import { describe, it, expect } from "vitest";
import { normalizeTenantSlug } from "../application/auth/tenant";

describe("normalizeTenantSlug", () => {
  it("normalizes slug", () => {
    expect(normalizeTenantSlug(" Acme Corp ")).toBe("acme-corp");
  });
});
