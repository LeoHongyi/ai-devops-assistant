import Fastify from "fastify";
import { registerHealthRoutes } from "./interfaces/http/routes/health";
import { registerIngestRoutes } from "./interfaces/http/routes/ingest";
import { registerIncidentRoutes } from "./interfaces/http/routes/incidents";
import { PrismaIncidentRepository } from "./infrastructure/repositories/prisma-incident-repo";
import { PrismaEventRepository } from "./infrastructure/repositories/prisma-event-repo";
import { prisma } from "./infrastructure/prisma-client";
import { registerSwagger } from "./interfaces/http/swagger";
import { registerRequestLogger } from "./interfaces/http/request-logger";
import { NatsBus } from "./infrastructure/event-bus/nats-bus";
import { NoopBus } from "./infrastructure/event-bus/noop-bus";

export async function createServer() {
  const app = Fastify({ logger: true });

  app.setErrorHandler((err, _req, reply) => {
    app.log.error(err);
    reply.status(500).send({ error: "internal_error" });
  });

  registerRequestLogger(app);
  await registerSwagger(app);

  const incidentRepo = new PrismaIncidentRepository(prisma);
  const eventRepo = new PrismaEventRepository(prisma);

  const natsUrl = process.env.NATS_URL;
  const bus = natsUrl ? await NatsBus.connect(natsUrl) : new NoopBus();

  registerHealthRoutes(app);
  registerIngestRoutes(app, bus, eventRepo);
  registerIncidentRoutes(app, incidentRepo);

  return app;
}
