import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["widgets/**/*.spec.ts", "widgets/**/*.test.ts"]
  }
})
