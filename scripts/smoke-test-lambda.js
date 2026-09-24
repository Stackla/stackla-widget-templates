#!/usr/bin/env node
// Sanity-checks the esbuild-bundled Lambda handler by actually invoking it in-process
// with a Function-URL-shaped event, rather than trusting the bundler blindly. Loading
// the handler module alone already exercises every eagerly-initialized piece of
// src/libs/express.ts (Express app setup, `hbs`/Handlebars view-engine registration,
// cors/cookie-parser/apicache middleware, mock routes) — the part of bundling most at
// risk of silently breaking (e.g. esbuild's handling of hbs/handlebars's dynamic
// requires) — which a CloudFormation-template assertion (cdk/stack.spec.ts) can't catch.
//
// Deliberately invokes a route with no on-disk template dependency
// (/development/stackla/cs/image/disable, a static JSON mock registered unconditionally
// in express.ts), not /preview or its siblings: getContent() in src/libs/express.ts
// resolves `dist/<widgetType>` via 5 literal `../` segments from the handler's own
// __dirname, a path depth that only happens to resolve correctly under local
// `sls offline` (which runs the compiled handler in place inside the repo checkout,
// preserving extra "server/service" nesting) — see the PR description for the full
// finding. That's a pre-existing app-level relative-path fragility unrelated to this
// infra migration; this smoke test intentionally doesn't depend on it either way.
const path = require("path")

const handlerPath = path.resolve(__dirname, "../dist-lambda/src/functions/main/handler.js")

const event = {
  version: "2.0",
  routeKey: "$default",
  rawPath: "/development/stackla/cs/image/disable",
  rawQueryString: "",
  headers: { "content-type": "text/plain" },
  requestContext: {
    http: {
      method: "GET",
      path: "/development/stackla/cs/image/disable",
      sourceIp: "127.0.0.1"
    }
  },
  isBase64Encoded: false
}

async function main() {
  const { main: handler } = require(handlerPath)
  const response = await handler(event, {})

  if (response.statusCode !== 200) {
    throw new Error(
      `Expected statusCode 200 from GET /development/stackla/cs/image/disable, got ${response.statusCode}: ${response.body}`
    )
  }

  const body = response.isBase64Encoded ? Buffer.from(response.body, "base64").toString("utf8") : response.body

  if (!JSON.parse(body).success) {
    throw new Error(`Expected {"success":true}, got: ${body.slice(0, 200)}`)
  }

  console.info("Smoke test passed: bundled handler booted and served a request end-to-end")
  // apicache's response-cache middleware (used by express.ts) schedules an internal
  // interval that otherwise keeps the Node event loop alive indefinitely — this is a
  // one-shot script, not a long-running server, so exit explicitly on success.
  process.exit(0)
}

main().catch(error => {
  console.error("Lambda smoke test failed:", error)
  process.exit(1)
})
