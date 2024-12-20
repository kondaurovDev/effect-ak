import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 30000,
    env: {
      "effect-ak-aws_project-id": "test-ak",
      LOG_LEVEL: "debug"
    }
  }
});
