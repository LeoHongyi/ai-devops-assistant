import "fastify";
import { AuthContext } from "../interfaces/http/auth";

declare module "fastify" {
  interface FastifyRequest {
    auth?: AuthContext;
  }
}
