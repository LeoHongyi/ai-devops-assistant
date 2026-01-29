import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { verifyPassword } from "../../../application/auth/password";
import { normalizeTenantSlug } from "../../../application/auth/tenant";

const loginSchema = z.object({
  email: z.string().email(),
  tenantSlug: z.string().min(1).optional(),
  tenantName: z.string().min(1).optional(),
  password: z.string().min(8)
}).refine((v) => Boolean(v.tenantSlug || v.tenantName), {
  message: "tenantSlug or tenantName is required",
  path: ["tenantSlug"]
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1)
});

export function registerAuthRoutes(app: FastifyInstance, prisma: PrismaClient) {
  app.post(
    "/auth/login",
    {
      schema: {
        tags: ["auth"],
        security: [],
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string" },
            tenantSlug: { type: "string" },
            tenantName: { type: "string" },
            password: { type: "string" }
          }
        }
      }
    },
    async (req, reply) => {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) return reply.status(400).send({ error: "invalid_request" });

      const { email, tenantSlug, tenantName, password } = parsed.data;
      const slug = tenantSlug ? normalizeTenantSlug(tenantSlug) : normalizeTenantSlug(tenantName ?? "");
      const tenant = await prisma.tenant.findFirst({ where: { slug } });
      if (!tenant) return reply.status(401).send({ error: "unauthorized" });

      const user = await prisma.user.findFirst({ where: { email, tenantId: tenant.id } });
      if (!user || !user.passwordHash) return reply.status(401).send({ error: "unauthorized" });

      const ok = await verifyPassword(password, user.passwordHash);
      if (!ok) return reply.status(401).send({ error: "unauthorized" });

      const accessToken = app.jwt.sign({ userId: user.id, tenantId: user.tenantId }, { expiresIn: "15m" });
      const refreshToken = app.jwt.sign({ userId: user.id, tenantId: user.tenantId }, { expiresIn: "7d" });

      return reply.status(200).send({ accessToken, refreshToken });
    }
  );

  app.post(
    "/auth/refresh",
    {
      schema: {
        tags: ["auth"],
        security: [],
        body: {
          type: "object",
          required: ["refreshToken"],
          properties: { refreshToken: { type: "string" } }
        }
      }
    },
    async (req, reply) => {
      const parsed = refreshSchema.safeParse(req.body);
      if (!parsed.success) return reply.status(400).send({ error: "invalid_request" });

      try {
        const payload = app.jwt.verify<{ userId: string; tenantId: string }>(parsed.data.refreshToken);
        const accessToken = app.jwt.sign({ userId: payload.userId, tenantId: payload.tenantId }, { expiresIn: "15m" });
        return reply.status(200).send({ accessToken });
      } catch {
        return reply.status(401).send({ error: "unauthorized" });
      }
    }
  );
}
