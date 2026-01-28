import { FastifyReply } from "fastify";
import { Result, AppError } from "../../application/result";

const statusByCode: Record<string, number> = {
  invalid_request: 400,
  not_found: 404,
  internal_error: 500
};

export function sendResult<T>(reply: FastifyReply, result: Result<T>) {
  if (result.ok) {
    return reply.status(200).send(result.value);
  }

  const code = result.error.code;
  const status = statusByCode[code] ?? 500;
  return reply.status(status).send({ error: code });
}

export function toInternalError(): Result<never> {
  return { ok: false, error: new AppError("internal_error") };
}
