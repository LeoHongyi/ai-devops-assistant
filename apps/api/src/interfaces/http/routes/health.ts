import type { FastifyInstance } from "fastify";
import { healthController } from "../controllers/health-controller";
import { sendResult } from "../result-mapper";

export function registerHealthRoutes(app: FastifyInstance) {
  app.get(
    "/health",
    {
      schema: {
        tags: ["system"],
        security: [],
        response: {
          200: {
            type: "object",
            properties: { ok: { type: "boolean" } }
          }
        }
      }
    },
    async (_req, reply) => sendResult(reply, healthController())
  );
}
