import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";

export function registerPermissionRoutes(
  app: FastifyInstance,
  prisma: PrismaClient,
  auth: (req: FastifyRequest, reply: FastifyReply) => Promise<unknown>
) {
  app.get(
    "/permissions",
    { preHandler: [auth], schema: { tags: ["rbac"], security: [{ bearerAuth: [] }] } },
    async (_req, reply) => {
      const perms = await prisma.permission.findMany();
      return reply.send(perms);
    }
  );
}
