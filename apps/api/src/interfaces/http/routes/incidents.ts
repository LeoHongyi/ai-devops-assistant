import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  createIncidentController,
  listIncidentsController,
  getIncidentController,
  closeIncidentController
} from "../controllers/incidents-controller";
import { IncidentRepository } from "../../../application/ports/incident-repository";
import { sendResult } from "../result-mapper";
import { AppError, err } from "../../../application/result";

const tenantSchema = z.string().min(1);
const createIncidentSchema = z.object({
  title: z.string().min(1),
  severity: z.enum(["low", "medium", "high", "critical"])
});

function getTenantId(req: { headers: Record<string, unknown> }) {
  const raw = req.headers["x-tenant-id"];
  const parsed = tenantSchema.safeParse(raw);
  if (!parsed.success) return null;
  return parsed.data;
}

export function registerIncidentRoutes(app: FastifyInstance, repo: IncidentRepository) {
  app.get(
    "/incidents",
    {
      schema: {
        tags: ["incidents"],
        headers: {
          type: "object",
          required: ["x-tenant-id"],
          properties: { "x-tenant-id": { type: "string" } }
        }
      }
    },
    async (req, reply) => {
      const tenantId = getTenantId(req as { headers: Record<string, unknown> });
      if (!tenantId) return sendResult(reply, err(new AppError("invalid_request")));
      return sendResult(reply, await listIncidentsController(repo, tenantId));
    }
  );

  app.post(
    "/incidents",
    {
      schema: {
        tags: ["incidents"],
        headers: {
          type: "object",
          required: ["x-tenant-id"],
          properties: { "x-tenant-id": { type: "string" } }
        },
        body: {
          type: "object",
          required: ["title", "severity"],
          properties: {
            title: { type: "string" },
            severity: { type: "string", enum: ["low", "medium", "high", "critical"] }
          }
        }
      }
    },
    async (req, reply) => {
      const tenantId = getTenantId(req as { headers: Record<string, unknown> });
      if (!tenantId) return sendResult(reply, err(new AppError("invalid_request")));
      const body = createIncidentSchema.safeParse(req.body);
      if (!body.success) return sendResult(reply, err(new AppError("invalid_request")));
      return sendResult(reply, await createIncidentController(repo, tenantId, body.data));
    }
  );

  app.get(
    "/incidents/:id",
    {
      schema: {
        tags: ["incidents"],
        headers: {
          type: "object",
          required: ["x-tenant-id"],
          properties: { "x-tenant-id": { type: "string" } }
        },
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "string" } }
        }
      }
    },
    async (req, reply) => {
      const tenantId = getTenantId(req as { headers: Record<string, unknown> });
      if (!tenantId) return sendResult(reply, err(new AppError("invalid_request")));
      const id = (req.params as { id: string }).id;
      return sendResult(reply, await getIncidentController(repo, tenantId, id));
    }
  );

  app.post(
    "/incidents/:id/close",
    {
      schema: {
        tags: ["incidents"],
        headers: {
          type: "object",
          required: ["x-tenant-id"],
          properties: { "x-tenant-id": { type: "string" } }
        },
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "string" } }
        }
      }
    },
    async (req, reply) => {
      const tenantId = getTenantId(req as { headers: Record<string, unknown> });
      if (!tenantId) return sendResult(reply, err(new AppError("invalid_request")));
      const id = (req.params as { id: string }).id;
      return sendResult(reply, await closeIncidentController(repo, tenantId, id));
    }
  );
}
