import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  "client/*",
  "codegen/*",
  "packages/*",
  "playground"
]);
