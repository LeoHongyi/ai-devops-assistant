import type { FastifyInstance } from "fastify";
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

const tenantSchema = z.string().min(1);

function getTenantId(headers: Record<string, unknown>) {
  const raw = headers["x-tenant-id"];
  const parsed = tenantSchema.safeParse(raw);
  if (!parsed.success) return null;
  return parsed.data;
}

export function registerIngestRoutes(app: FastifyInstance, bus: EventBus, repo: EventRepository) {
  app.post(
    "/ingest/webhook",
    {
      schema: {
        tags: ["ingest"],
        headers: {
          type: "object",
          required: ["x-tenant-id"],
          properties: { "x-tenant-id": { type: "string" } }
        }
      }
    },
    async (req, reply) => {
      const tenantId = getTenantId(req.headers as Record<string, unknown>);
      if (!tenantId) return sendResult(reply, err(new AppError("invalid_request")));
      const parsed = ingestSchema.safeParse(req.body ?? {});
      if (!parsed.success) return sendResult(reply, err(new AppError("invalid_request")));
      return sendResult(
        reply,
        await ingestController(bus, repo, {
          tenantId,
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
      schema: {
        tags: ["ingest"],
        headers: {
          type: "object",
          required: ["x-tenant-id"],
          properties: { "x-tenant-id": { type: "string" } }
        }
      }
    },
    async (req, reply) => {
      const tenantId = getTenantId(req.headers as Record<string, unknown>);
      if (!tenantId) return sendResult(reply, err(new AppError("invalid_request")));
      const parsed = ingestSchema.safeParse(req.body ?? {});
      if (!parsed.success) return sendResult(reply, err(new AppError("invalid_request")));
      return sendResult(
        reply,
        await ingestController(bus, repo, {
          tenantId,
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
      schema: {
        tags: ["ingest"],
        headers: {
          type: "object",
          required: ["x-tenant-id"],
          properties: { "x-tenant-id": { type: "string" } }
        }
      }
    },
    async (req, reply) => {
      const tenantId = getTenantId(req.headers as Record<string, unknown>);
      if (!tenantId) return sendResult(reply, err(new AppError("invalid_request")));
      const parsed = ingestSchema.safeParse(req.body ?? {});
      if (!parsed.success) return sendResult(reply, err(new AppError("invalid_request")));
      return sendResult(
        reply,
        await ingestController(bus, repo, {
          tenantId,
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
      schema: {
        tags: ["ingest"],
        headers: {
          type: "object",
          required: ["x-tenant-id"],
          properties: { "x-tenant-id": { type: "string" } }
        }
      }
    },
    async (req, reply) => {
      const tenantId = getTenantId(req.headers as Record<string, unknown>);
      if (!tenantId) return sendResult(reply, err(new AppError("invalid_request")));
      const parsed = ingestSchema.safeParse(req.body ?? {});
      if (!parsed.success) return sendResult(reply, err(new AppError("invalid_request")));
      return sendResult(
        reply,
        await ingestController(bus, repo, {
          tenantId,
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
