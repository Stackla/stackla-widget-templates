// eslint-disable-next-line import/no-extraneous-dependencies
import { configureVisualRegression } from "cypress-visual-regression"
// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from "cypress"

export default defineConfig({
  e2e: {
    env: {
      visualRegressionType: process.env.VISUAL_REGRESSION_TYPE ?? "regression",
      visualRegressionGenerateDiff: "always",
      visualRegressionFailSilently: false
    },
    baseUrl: "http://localhost:4002",
    supportFile: "cypress/support/e2e.ts",
    video: true,
    setupNodeEvents(on, config) {
      configureVisualRegression(on)
      return config
    },
    projectId: "2ns45q"
  }
})
