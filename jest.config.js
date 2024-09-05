const tsConfig = require("./tsconfig.json")
const baseConfig = require("@stackla/jest-config")

module.exports = {
  ...baseConfig({ tsConfig }),
  testEnvironment: "@happy-dom/jest-environment",
  globalSetup: "./tests/setup.ts",
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!src/**/*.d.ts",
    "!src/**/*.spec.ts",
    "!src/**/*.test.ts",
    "!src/**/*.spec.js",
    "!src/**/*.test.js",
    "!src/**/index.ts",
    "!src/**/index.js",
    "!src/**/exceptions/**",
    "!src/functions/**",
    "!src/libs/**",
    "!src/**/*.template.ts",
    "!src/**/*.component.ts",
    "!src/**/*.style.ts",
    "!src/**/*.interface.ts",
    "!src/ui/packages/**",
    "!**/types/**",
    "!**/interfaces/**"
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["json", "lcov", "text", "clover", "html"],
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  transformIgnorePatterns: ["/node_modules/(?!(@stackla)/)"]
}
