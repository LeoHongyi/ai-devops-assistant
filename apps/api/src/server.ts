import Fastify from "fastify";
import { registerHealthRoutes } from "./interfaces/http/routes/health";
import { registerIngestRoutes } from "./interfaces/http/routes/ingest";
import { registerIncidentRoutes } from "./interfaces/http/routes/incidents";
import { registerAuthRoutes } from "./interfaces/http/routes/auth";
import { registerRoleRoutes } from "./interfaces/http/routes/roles";
import { registerUserRoutes } from "./interfaces/http/routes/users";
import { registerPermissionRoutes } from "./interfaces/http/routes/permissions";
import { PrismaIncidentRepository } from "./infrastructure/repositories/prisma-incident-repo";
import { PrismaEventRepository } from "./infrastructure/repositories/prisma-event-repo";
import { prisma } from "./infrastructure/prisma-client";
import { registerSwagger } from "./interfaces/http/swagger";
import { registerRequestLogger } from "./interfaces/http/request-logger";
import { NatsBus } from "./infrastructure/event-bus/nats-bus";
import { NoopBus } from "./infrastructure/event-bus/noop-bus";
import { registerAuth, requireAuth, requirePermission } from "./interfaces/http/auth";
import { Permissions } from "./application/auth/permissions";

export async function createServer() {
  const app = Fastify({ logger: true });

  app.setErrorHandler((err, _req, reply) => {
    app.log.error(err);
    reply.status(500).send({ error: "internal_error" });
  });

  registerRequestLogger(app);
  await registerSwagger(app);
  await registerAuth(app);

  const incidentRepo = new PrismaIncidentRepository(prisma);
  const eventRepo = new PrismaEventRepository(prisma);

  const natsUrl = process.env.NATS_URL;
  const bus = natsUrl ? await NatsBus.connect(natsUrl) : new NoopBus();

  const auth = requireAuth(prisma);
  const canIngest = requirePermission(Permissions.IngestWrite);
  const canReadIncidents = requirePermission(Permissions.IncidentsRead);
  const canWriteIncidents = requirePermission(Permissions.IncidentsWrite);

  registerHealthRoutes(app);
  registerAuthRoutes(app, prisma);
  registerPermissionRoutes(app, prisma, auth);
  registerRoleRoutes(app, prisma, auth);
  registerUserRoutes(app, prisma, auth);
  registerIngestRoutes(app, bus, eventRepo, auth, canIngest);
  registerIncidentRoutes(app, incidentRepo, auth, canReadIncidents, canWriteIncidents);

  return app;
}
