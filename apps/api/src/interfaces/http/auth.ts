import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";
import { PrismaClient } from "@prisma/client";
import { PermissionKey, hasPermission } from "../../application/auth/permissions";

export interface AuthContext {
  userId: string;
  tenantId: string;
  roleId?: string | null;
  permissions: string[];
}

export async function registerAuth(app: FastifyInstance) {
  const secret = process.env.JWT_SECRET ?? "dev-secret";
  await app.register(fastifyJwt, { secret });
}

export function requireAuth(prisma: PrismaClient) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const payload = await req.jwtVerify<{ userId: string; tenantId: string }>();
      const user = await prisma.user.findFirst({
        where: { id: payload.userId, tenantId: payload.tenantId },
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true }
              }
            }
          }
        }
      });

      if (!user) {
        return reply.status(401).send({ error: "unauthorized" });
      }

      const perms = (user.role?.permissions ?? []).map((p: { permission: { key: string } }) => p.permission.key);
      req.auth = {
        userId: user.id,
        tenantId: user.tenantId,
        roleId: user.roleId,
        permissions: perms
      };
    } catch {
      return reply.status(401).send({ error: "unauthorized" });
    }
  };
}

export function requirePermission(required: PermissionKey) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    if (!req.auth) {
      return reply.status(401).send({ error: "unauthorized" });
    }

    if (!hasPermission(req.auth.permissions, required)) {
      return reply.status(403).send({ error: "forbidden" });
    }
  };
}
