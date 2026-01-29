import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../../application/auth/password";

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(8),
  roleId: z.string().min(1)
});

export function registerUserRoutes(
  app: FastifyInstance,
  prisma: PrismaClient,
  auth: (req: FastifyRequest, reply: FastifyReply) => Promise<unknown>
) {
  app.get(
    "/users",
    { preHandler: [auth], schema: { tags: ["rbac"], security: [{ bearerAuth: [] }] } },
    async (req, reply) => {
      const tenantId = req.auth?.tenantId;
      if (!tenantId) return reply.status(400).send({ error: "invalid_request" });
      const users = await prisma.user.findMany({ where: { tenantId } });
      return reply.send(users);
    }
  );

  app.post(
    "/users",
    { preHandler: [auth], schema: { tags: ["rbac"], security: [{ bearerAuth: [] }] } },
    async (req, reply) => {
      const tenantId = req.auth?.tenantId;
      if (!tenantId) return reply.status(400).send({ error: "invalid_request" });

      const parsed = createUserSchema.safeParse(req.body);
      if (!parsed.success) return reply.status(400).send({ error: "invalid_request" });

      const { email, name, password, roleId } = parsed.data;
      const passwordHash = await hashPassword(password);
      const user = await prisma.user.create({
        data: { tenantId, email, name, roleId, passwordHash }
      });

      return reply.status(201).send(user);
    }
  );
}
