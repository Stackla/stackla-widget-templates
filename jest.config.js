const tsConfig = require("./tsconfig.json")

const { pathsToModuleNameMapper } = require("ts-jest")
const path = require("path")

function getPaths(paths, allowInternals = false) {
  if (allowInternals) {
    return paths
  }
  return Object.fromEntries(Object.entries(paths).filter(([key]) => !key.includes("@stackla/*")))
}

const baseConfig = ({ tsConfig = {}, allowInternals = true }) => ({
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  setupFilesAfterEnv: [path.resolve(__dirname, "tests", "setup-env-vars.js")],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
  ...(tsConfig.compilerOptions &&
    tsConfig.compilerOptions.paths && {
      moduleNameMapper: pathsToModuleNameMapper(getPaths(tsConfig.compilerOptions.paths, allowInternals), {
        prefix: "<rootDir>/"
      })
    })
})

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
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/.serverless/", "/packages/"],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["json", "lcov", "text", "clover", "html"],
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.mjs$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!swiper)" // Transpile the swiper module
  ]
}
