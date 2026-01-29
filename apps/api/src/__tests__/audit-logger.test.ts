import { describe, it, expect } from "vitest";
import { sanitizeBody, shouldAudit } from "../interfaces/http/audit-logger";

function mockReq(overrides: Partial<any> = {}) {
  return {
    method: "POST",
    url: "/incidents",
    ...overrides
  } as any;
}

function mockReply(overrides: Partial<any> = {}) {
  return {
    statusCode: 200,
    ...overrides
  } as any;
}

describe("audit-logger", () => {
  it("sanitizes password fields", () => {
    const body = { email: "a@b.com", password: "secret", refreshToken: "rt" };
    const out = sanitizeBody(body) as Record<string, unknown>;
    expect(out.password).toBeUndefined();
    expect(out.refreshToken).toBeUndefined();
  });

  it("audits only mutating, successful requests", () => {
    expect(shouldAudit(mockReq({ method: "GET" }), mockReply())).toBe(false);
    expect(shouldAudit(mockReq(), mockReply({ statusCode: 500 }))).toBe(false);
    expect(shouldAudit(mockReq({ url: "/auth/login" }), mockReply())).toBe(false);
    expect(shouldAudit(mockReq(), mockReply())).toBe(true);
  });
});
