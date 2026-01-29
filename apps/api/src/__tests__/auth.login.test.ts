import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../application/auth/password";

describe("password", () => {
  it("hashes and verifies", async () => {
    const hash = await hashPassword("password123");
    const ok = await verifyPassword("password123", hash);
    expect(ok).toBe(true);
  });
});
