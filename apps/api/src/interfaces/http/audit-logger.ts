import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";

const SKIP_PREFIXES = ["/docs", "/health"];
const SKIP_EXACT = ["/auth/login", "/auth/refresh"];
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function shouldAudit(req: FastifyRequest, reply: FastifyReply): boolean {
  if (!MUTATING_METHODS.has(req.method)) return false;
  if (reply.statusCode >= 400) return false;
  if (SKIP_EXACT.includes(req.url)) return false;
  for (const p of SKIP_PREFIXES) {
    if (req.url.startsWith(p)) return false;
  }
  return true;
}

export function sanitizeBody(body: unknown): unknown {
  if (!body || typeof body !== "object") return body;
  if (Array.isArray(body)) return body.map((b) => sanitizeBody(b));

  const clone: Record<string, unknown> = { ...(body as Record<string, unknown>) };
  if ("password" in clone) delete clone.password;
  if ("refreshToken" in clone) delete clone.refreshToken;
  return clone;
}

export function registerAuditLogger(app: FastifyInstance, prisma: PrismaClient) {
  app.addHook("onResponse", async (req, reply) => {
    if (!shouldAudit(req, reply)) return;
    if (!req.auth) return;

    const metadata = {
      method: req.method,
      url: req.url,
      statusCode: reply.statusCode,
      requestId: req.headers["x-request-id"],
      params: req.params,
      query: req.query,
      body: sanitizeBody(req.body)
    };

    await prisma.auditLog.create({
      data: {
        tenantId: req.auth.tenantId,
        actorId: req.auth.userId,
        action: `${req.method} ${req.url}`,
        target: req.url,
        metadata
      }
    });
  });
}
