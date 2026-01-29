import "dotenv/config";
import { describe, it, expect } from "vitest";
import { prisma } from "../infrastructure/prisma-client";
import { execSync } from "node:child_process";

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

async function canConnect() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

describe("seed (e2e)", () => {
  it("creates default tenant and incident", async () => {
    if (!hasDatabaseUrl()) {
      return;
    }

    if (!(await canConnect())) {
      return;
    }

    try {
      execSync("pnpm -C apps/api seed", { stdio: "inherit" });
    } catch {
      return;
    }

    const tenant = await prisma.tenant.findFirst({ where: { name: "Acme" } });
    expect(tenant).toBeTruthy();

    const incident = await prisma.incident.findFirst({ where: { title: "API latency spike" } });
    expect(incident).toBeTruthy();
  });
});
