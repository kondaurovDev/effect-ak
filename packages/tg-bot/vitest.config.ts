import { defineConfig } from 'vitest/config'
import path from 'path'

import * as integrationConfig from "./integration-config.json"

export default defineConfig({
  test: {
    testTimeout: 30000,
    env: {
      ...integrationConfig
    },
    alias: {
      '~': path.resolve(__dirname, './src')
    }
  }
})