import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ingestController } from "../controllers/ingest-controller";
import { sendResult } from "../result-mapper";
import { AppError, err } from "../../../application/result";
import { EventBus } from "../../../application/ports/event-bus";
import { EventRepository } from "../../../application/ports/event-repository";

const ingestSchema = z.object({
  payload: z.unknown().optional(),
  severity: z.string().optional(),
  serviceId: z.string().optional()
});

export function registerIngestRoutes(
  app: FastifyInstance,
  bus: EventBus,
  repo: EventRepository,
  auth: (req: FastifyRequest, reply: FastifyReply) => Promise<unknown>,
  permit: (req: FastifyRequest, reply: FastifyReply) => Promise<unknown>
) {
  app.post(
    "/ingest/webhook",
    {
      preHandler: [auth, permit],
      schema: {
        tags: ["ingest"],
        security: [{ bearerAuth: [] }]
      }
    },
    async (req, reply) => {
      const parsed = ingestSchema.safeParse(req.body ?? {});
      if (!parsed.success) return sendResult(reply, err(new AppError("invalid_request")));
      return sendResult(
        reply,
        await ingestController(bus, repo, {
          tenantId: req.auth?.tenantId,
          source: "webhook",
          type: "event",
          payload: parsed.data.payload,
          severity: parsed.data.severity,
          serviceId: parsed.data.serviceId
        })
      );
    }
  );

  app.post(
    "/ingest/logs",
    {
      preHandler: [auth, permit],
      schema: {
        tags: ["ingest"],
        security: [{ bearerAuth: [] }]
      }
    },
    async (req, reply) => {
      const parsed = ingestSchema.safeParse(req.body ?? {});
      if (!parsed.success) return sendResult(reply, err(new AppError("invalid_request")));
      return sendResult(
        reply,
        await ingestController(bus, repo, {
          tenantId: req.auth?.tenantId,
          source: "logs",
          type: "batch",
          payload: parsed.data.payload,
          severity: parsed.data.severity,
          serviceId: parsed.data.serviceId
        })
      );
    }
  );

  app.post(
    "/ingest/metrics",
    {
      preHandler: [auth, permit],
      schema: {
        tags: ["ingest"],
        security: [{ bearerAuth: [] }]
      }
    },
    async (req, reply) => {
      const parsed = ingestSchema.safeParse(req.body ?? {});
      if (!parsed.success) return sendResult(reply, err(new AppError("invalid_request")));
      return sendResult(
        reply,
        await ingestController(bus, repo, {
          tenantId: req.auth?.tenantId,
          source: "metrics",
          type: "batch",
          payload: parsed.data.payload,
          severity: parsed.data.severity,
          serviceId: parsed.data.serviceId
        })
      );
    }
  );

  app.post(
    "/ingest/traces",
    {
      preHandler: [auth, permit],
      schema: {
        tags: ["ingest"],
        security: [{ bearerAuth: [] }]
      }
    },
    async (req, reply) => {
      const parsed = ingestSchema.safeParse(req.body ?? {});
      if (!parsed.success) return sendResult(reply, err(new AppError("invalid_request")));
      return sendResult(
        reply,
        await ingestController(bus, repo, {
          tenantId: req.auth?.tenantId,
          source: "traces",
          type: "batch",
          payload: parsed.data.payload,
          severity: parsed.data.severity,
          serviceId: parsed.data.serviceId
        })
      );
    }
  );
}
