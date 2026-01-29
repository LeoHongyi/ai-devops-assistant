import "dotenv/config";
import { prisma } from "./infrastructure/prisma-client";

async function main() {
  const existing = await prisma.tenant.findFirst({ where: { name: "Acme" } });
  const tenant = existing ?? (await prisma.tenant.create({ data: { name: "Acme", plan: "free" } }));

  await prisma.incident.create({
    data: {
      tenantId: tenant.id,
      title: "API latency spike",
      severity: "high",
      status: "open"
    }
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
