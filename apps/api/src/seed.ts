import "dotenv/config";
import { prisma } from "./infrastructure/prisma-client";
import { Permissions } from "./application/auth/permissions";
import { hashPassword } from "./application/auth/password";
import { normalizeTenantSlug } from "./application/auth/tenant";

async function main() {
  const slug = normalizeTenantSlug("Acme");
  const tenant = await prisma.tenant.findFirst({ where: { slug } })
    ?? (await prisma.tenant.create({ data: { name: "Acme", slug, plan: "free" } }));

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

  const existing = await prisma.user.findFirst({ where: { tenantId: tenant.id, email: "admin@acme.com" } });
  if (!existing) {
    const passwordHash = await hashPassword("ChangeMe123!");
    await prisma.user.create({
      data: { tenantId: tenant.id, email: "admin@acme.com", name: "Admin", roleId: adminRole.id, passwordHash }
    });
  }

  await prisma.incident.create({
    data: {
      tenantId: tenant.id,
      title: "API latency spike",
      severity: "high",
      status: "open"
    }
  });

  return { tenant };
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
