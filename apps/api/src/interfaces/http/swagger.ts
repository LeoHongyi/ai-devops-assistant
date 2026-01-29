import { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export async function registerSwagger(app: FastifyInstance) {
  await app.register(swagger, {
    swagger: {
      info: {
        title: "AI DevOps Assistant API",
        description: "API documentation. Use Authorization header: Bearer <accessToken>.",
        version: "0.1.0"
      },
      securityDefinitions: {
        bearerAuth: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
          description: "Bearer <accessToken>"
        }
      }
    }
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list"
    }
  });
}
