import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const createRoleSchema = z.object({
  name: z.string().min(1),
  permissions: z.array(z.string()).min(1)
});

export function registerRoleRoutes(
  app: FastifyInstance,
  prisma: PrismaClient,
  auth: (req: FastifyRequest, reply: FastifyReply) => Promise<unknown>
) {
  app.get(
    "/roles",
    { preHandler: [auth], schema: { tags: ["rbac"], security: [{ bearerAuth: [] }] } },
    async (req, reply) => {
      const tenantId = req.auth?.tenantId;
      if (!tenantId) return reply.status(400).send({ error: "invalid_request" });
      const roles = await prisma.role.findMany({ where: { tenantId }, include: { permissions: { include: { permission: true } } } });
      return reply.send(roles);
    }
  );

  app.post(
    "/roles",
    { preHandler: [auth], schema: { tags: ["rbac"], security: [{ bearerAuth: [] }] } },
    async (req, reply) => {
      const tenantId = req.auth?.tenantId;
      if (!tenantId) return reply.status(400).send({ error: "invalid_request" });

      const parsed = createRoleSchema.safeParse(req.body);
      if (!parsed.success) return reply.status(400).send({ error: "invalid_request" });

      const { name, permissions } = parsed.data;
      const role = await prisma.role.create({ data: { tenantId, name } });

      const perms = await prisma.permission.findMany({ where: { key: { in: permissions } } });
      for (const p of perms) {
        await prisma.rolePermission.create({ data: { roleId: role.id, permissionId: p.id } });
      }

      return reply.status(201).send(role);
    }
  );
}
