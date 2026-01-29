import "dotenv/config";
import { prisma } from "./infrastructure/prisma-client";
import { Permissions } from "./application/auth/permissions";

async function main() {
  const tenant = await prisma.tenant.findFirst({ where: { name: "Acme" } })
    ?? (await prisma.tenant.create({ data: { name: "Acme", plan: "free" } }));

  const perms = [Permissions.IngestWrite, Permissions.IncidentsRead, Permissions.IncidentsWrite];

  for (const key of perms) {
    await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key }
    });
  }

  const adminRole = await prisma.role.findFirst({ where: { tenantId: tenant.id, name: "admin" } })
    ?? (await prisma.role.create({ data: { tenantId: tenant.id, name: "admin" } }));

  const permissionRecords = await prisma.permission.findMany({ where: { key: { in: perms } } });

  for (const p of permissionRecords) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: p.id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: p.id }
    });
  }

  const adminUser = await prisma.user.findFirst({ where: { tenantId: tenant.id, email: "admin@acme.com" } })
    ?? (await prisma.user.create({ data: { tenantId: tenant.id, email: "admin@acme.com", name: "Admin", roleId: adminRole.id } }));

  await prisma.incident.create({
    data: {
      tenantId: tenant.id,
      title: "API latency spike",
      severity: "high",
      status: "open"
    }
  });

  return { tenant, adminUser };
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
