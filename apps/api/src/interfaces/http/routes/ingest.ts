import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { ingestController } from "../controllers/ingest-controller";
import { sendResult } from "../result-mapper";
import { AppError, err } from "../../../application/result";
import { EventBus } from "../../../application/ports/event-bus";

const ingestSchema = z.object({
  payload: z.unknown().optional()
});

const tenantSchema = z.string().min(1).optional();

function getTenantId(headers: Record<string, unknown>) {
  const raw = headers["x-tenant-id"];
  const parsed = tenantSchema.safeParse(raw);
  if (!parsed.success) return undefined;
  return parsed.data;
}

export function registerIngestRoutes(app: FastifyInstance, bus: EventBus) {
  app.post("/ingest/webhook", async (req, reply) => {
    const parsed = ingestSchema.safeParse(req.body ?? {});
    if (!parsed.success) return sendResult(reply, err(new AppError("invalid_request")));
    return sendResult(
      reply,
      await ingestController(bus, { source: "webhook", type: "event", payload: parsed.data.payload, tenantId: getTenantId(req.headers) })
    );
  });

  app.post("/ingest/logs", async (req, reply) => {
    const parsed = ingestSchema.safeParse(req.body ?? {});
    if (!parsed.success) return sendResult(reply, err(new AppError("invalid_request")));
    return sendResult(
      reply,
      await ingestController(bus, { source: "logs", type: "batch", payload: parsed.data.payload, tenantId: getTenantId(req.headers) })
    );
  });

  app.post("/ingest/metrics", async (req, reply) => {
    const parsed = ingestSchema.safeParse(req.body ?? {});
    if (!parsed.success) return sendResult(reply, err(new AppError("invalid_request")));
    return sendResult(
      reply,
      await ingestController(bus, { source: "metrics", type: "batch", payload: parsed.data.payload, tenantId: getTenantId(req.headers) })
    );
  });

  app.post("/ingest/traces", async (req, reply) => {
    const parsed = ingestSchema.safeParse(req.body ?? {});
    if (!parsed.success) return sendResult(reply, err(new AppError("invalid_request")));
    return sendResult(
      reply,
      await ingestController(bus, { source: "traces", type: "batch", payload: parsed.data.payload, tenantId: getTenantId(req.headers) })
    );
  });
}
