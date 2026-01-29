import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const loginSchema = z.object({
  email: z.string().email(),
  tenantId: z.string().min(1)
});

export function registerAuthRoutes(app: FastifyInstance, prisma: PrismaClient) {
  app.post(
    "/auth/login",
    {
      schema: {
        tags: ["auth"],
        body: {
          type: "object",
          required: ["email", "tenantId"],
          properties: {
            email: { type: "string" },
            tenantId: { type: "string" }
          }
        }
      }
    },
    async (req, reply) => {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) return reply.status(400).send({ error: "invalid_request" });

      const { email, tenantId } = parsed.data;
      const user = await prisma.user.findFirst({ where: { email, tenantId } });
      if (!user) return reply.status(401).send({ error: "unauthorized" });

      const token = app.jwt.sign({ userId: user.id, tenantId: user.tenantId });
      return reply.status(200).send({ token });
    }
  );
}
