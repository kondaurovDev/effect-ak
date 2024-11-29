import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    conditions: ['effect-ak-dev'],
  },
  test: {
    testTimeout: 30000,
    env: {
      "effect-ak-aws_project-id": "test-ak",
      LOG_LEVEL: "debug"
    }
  }
});
