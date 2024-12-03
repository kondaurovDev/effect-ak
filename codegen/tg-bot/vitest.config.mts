import { defineConfig } from 'vitest/config'
import path from 'path';

export default defineConfig({
  test: {
    env: {
      LOG_LEVEL: "debug"
    },
    alias: {
      '#': path.resolve(__dirname, 'src'),
    } 
  },
  
});
