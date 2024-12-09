import { defineConfig } from 'vitest/config'
import path from 'path'

import * as config from "./config.json"

export default defineConfig({
  test: {
    testTimeout: 30000,
    env: {
      ...config
    },
    alias: {
      '~': path.resolve(__dirname, './src')
    }
  }
})