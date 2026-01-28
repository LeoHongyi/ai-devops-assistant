import Fastify from "fastify";
import { registerHealthRoutes } from "./interfaces/http/routes/health";
import { registerIngestRoutes } from "./interfaces/http/routes/ingest";
import { registerIncidentRoutes } from "./interfaces/http/routes/incidents";
import { PrismaIncidentRepository } from "./infrastructure/repositories/prisma-incident-repo";
import { prisma } from "./infrastructure/prisma-client";

export function createServer() {
  const app = Fastify({ logger: true });

  app.setErrorHandler((err, _req, reply) => {
    app.log.error(err);
    reply.status(500).send({ error: "internal_error" });
  });

  const incidentRepo = new PrismaIncidentRepository(prisma);

  registerHealthRoutes(app);
  registerIngestRoutes(app);
  registerIncidentRoutes(app, incidentRepo);

  return app;
}
