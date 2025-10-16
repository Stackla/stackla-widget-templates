import expressApp from "../../libs/express"

// For AWS Lambda deployment (when serverless-http is available)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let main: any

try {
  // Only load serverless-http if it's available (for Lambda deployments)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const serverless = require("serverless-http")
  main = serverless(expressApp, {
    binary: ["image/*"]
  })
} catch (error) {
  // If serverless-http is not available, export the express app directly
  // This allows the app to be used in standalone mode
  main = expressApp
}

export { main }
export { expressApp }
