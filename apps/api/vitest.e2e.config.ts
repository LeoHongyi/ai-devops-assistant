import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    testMatch: ["**/*.e2e.test.ts"]
  }
});
