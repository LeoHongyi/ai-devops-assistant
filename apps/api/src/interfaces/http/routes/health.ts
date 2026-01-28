import type { FastifyInstance } from "fastify";
import { healthController } from "../controllers/health-controller";
import { sendResult } from "../result-mapper";

export function registerHealthRoutes(app: FastifyInstance) {
  app.get("/health", async (_req, reply) => sendResult(reply, healthController()));
}
