import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    testTimeout: 30000,
    env: {
      "effect-ak-aws_project-id": "test-ak",
      LOG_LEVEL: "debug"
    },
    alias: {
      '~': path.resolve(__dirname, './src')
    }
  }
});
