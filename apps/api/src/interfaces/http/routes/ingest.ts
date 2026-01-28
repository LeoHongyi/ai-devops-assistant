import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { ingestController } from "../controllers/ingest-controller";
import { sendResult } from "../result-mapper";
import { AppError, err } from "../../application/result";

const ingestSchema = z.object({
  payload: z.unknown().optional()
});

export function registerIngestRoutes(app: FastifyInstance) {
  app.post("/ingest/webhook", async (req, reply) => {
    const parsed = ingestSchema.safeParse(req.body ?? {});
    if (!parsed.success) return sendResult(reply, err(new AppError("invalid_request")));
    return sendResult(reply, ingestController({ source: "webhook", type: "event", payload: parsed.data.payload }));
  });

  app.post("/ingest/logs", async (req, reply) => {
    const parsed = ingestSchema.safeParse(req.body ?? {});
    if (!parsed.success) return sendResult(reply, err(new AppError("invalid_request")));
    return sendResult(reply, ingestController({ source: "logs", type: "batch", payload: parsed.data.payload }));
  });

  app.post("/ingest/metrics", async (req, reply) => {
    const parsed = ingestSchema.safeParse(req.body ?? {});
    if (!parsed.success) return sendResult(reply, err(new AppError("invalid_request")));
    return sendResult(reply, ingestController({ source: "metrics", type: "batch", payload: parsed.data.payload }));
  });

  app.post("/ingest/traces", async (req, reply) => {
    const parsed = ingestSchema.safeParse(req.body ?? {});
    if (!parsed.success) return sendResult(reply, err(new AppError("invalid_request")));
    return sendResult(reply, ingestController({ source: "traces", type: "batch", payload: parsed.data.payload }));
  });
}
