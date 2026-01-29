import type { FastifyInstance } from "fastify";
import crypto from "crypto";

export function registerRequestLogger(app: FastifyInstance) {
  app.addHook("onRequest", async (req) => {
    const id = req.headers["x-request-id"];
    const requestId = typeof id === "string" && id.length > 0 ? id : crypto.randomUUID();
    req.headers["x-request-id"] = requestId;
    req.log = req.log.child({ requestId });
  });

  app.addHook("onSend", async (req, reply, _payload) => {
    const requestId = req.headers["x-request-id"] as string | undefined;
    if (requestId) reply.header("x-request-id", requestId);
  });
}
