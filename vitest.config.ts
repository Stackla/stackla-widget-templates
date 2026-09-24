import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["widgets/**/*.spec.ts", "widgets/**/*.test.ts", "cdk/**/*.spec.ts"],
    // cdk/stack.spec.ts synthesizes full CloudFormation templates (several times per
    // test, across stages) — slower than a typical unit assertion and, on a loaded CI
    // runner, can exceed vitest's 5s default.
    testTimeout: 20000
  }
})
