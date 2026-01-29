import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
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

const createIncidentSchema = z.object({
  title: z.string().min(1),
  severity: z.enum(["low", "medium", "high", "critical"])
});

export function registerIncidentRoutes(
  app: FastifyInstance,
  repo: IncidentRepository,
  auth: (req: FastifyRequest, reply: FastifyReply) => Promise<unknown>,
  permitRead: (req: FastifyRequest, reply: FastifyReply) => Promise<unknown>,
  permitWrite: (req: FastifyRequest, reply: FastifyReply) => Promise<unknown>
) {
  app.get(
    "/incidents",
    {
      preHandler: [auth, permitRead],
      schema: {
        tags: ["incidents"],
        security: [{ bearerAuth: [] }]
      }
    },
    async (req, reply) => {
      const tenantId = req.auth?.tenantId;
      if (!tenantId) return sendResult(reply, err(new AppError("invalid_request")));
      return sendResult(reply, await listIncidentsController(repo, tenantId));
    }
  );

  app.post(
    "/incidents",
    {
      preHandler: [auth, permitWrite],
      schema: {
        tags: ["incidents"],
        security: [{ bearerAuth: [] }],
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
      const tenantId = req.auth?.tenantId;
      if (!tenantId) return sendResult(reply, err(new AppError("invalid_request")));
      const body = createIncidentSchema.safeParse(req.body);
      if (!body.success) return sendResult(reply, err(new AppError("invalid_request")));
      return sendResult(reply, await createIncidentController(repo, tenantId, body.data));
    }
  );

  app.get(
    "/incidents/:id",
    {
      preHandler: [auth, permitRead],
      schema: {
        tags: ["incidents"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "string" } }
        }
      }
    },
    async (req, reply) => {
      const tenantId = req.auth?.tenantId;
      if (!tenantId) return sendResult(reply, err(new AppError("invalid_request")));
      const id = (req.params as { id: string }).id;
      return sendResult(reply, await getIncidentController(repo, tenantId, id));
    }
  );

  app.post(
    "/incidents/:id/close",
    {
      preHandler: [auth, permitWrite],
      schema: {
        tags: ["incidents"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "string" } }
        }
      }
    },
    async (req, reply) => {
      const tenantId = req.auth?.tenantId;
      if (!tenantId) return sendResult(reply, err(new AppError("invalid_request")));
      const id = (req.params as { id: string }).id;
      return sendResult(reply, await closeIncidentController(repo, tenantId, id));
    }
  );
}
