import "dotenv/config";
import { prisma } from "./infrastructure/prisma-client";
import { PrismaEventRepository } from "./infrastructure/repositories/prisma-event-repo";
import { startIngestConsumer } from "./infrastructure/event-bus/nats-consumer";

async function main() {
  const url = process.env.NATS_URL;
  if (!url) {
    throw new Error("NATS_URL is required to start consumer");
  }

  const repo = new PrismaEventRepository(prisma);
  await startIngestConsumer(url, repo);
  // keep process alive
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
