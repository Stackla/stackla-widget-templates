import { handle } from "@hono/node-server"
import honoApp from "../../libs/hono"
import serverless from "serverless-http"

// Create a Node.js compatible handler from Hono app
const nodeHandler = handle(honoApp)

// Wrap with serverless-http for AWS Lambda
const main = serverless(nodeHandler, {
  binary: ["image/*"]
})

export { main }
