import { defineConfig } from "vitest/config"
import env from "./integration-config.json"

export default defineConfig({
  test: {
    testTimeout: 10000,
    env: {
      LOG_LEVEL: "debug",
      ...env
    }
  }
})