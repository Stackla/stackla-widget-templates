// Local dev/E2E server — replaces `sls offline`. expressApp (src/libs/express.ts) is
// already framework-agnostic; serverless-http (src/functions/main/handler.ts) only wraps
// it for real Lambda event translation — but that wrapper does two things local dev needs
// to replicate, not just skip, or the app breaks in ways that don't show up as obviously
// as a build failure (both confirmed by running the actual e2e suite against this server,
// not just curling a couple of routes by hand):
//
// 1. serverless-http's ServerlessRequest sets `req.body` directly to the raw request body
//    string (node_modules/serverless-http/lib/request.js — `Object.assign(this, { body,
//    ... })`, no JSON parsing). express.ts's own routes (e.g. `POST
//    /development/widgets/:wid/draft`) call `JSON.parse(req.body)` themselves, assuming
//    that string is already there — standard Express never populates `req.body` at all
//    without body-parser middleware, which express.ts doesn't register. A bare
//    `expressApp.listen()` therefore gets `req.body === undefined` and
//    `JSON.parse(undefined)` throws.
// 2. That throw happens inside an async handler with no try/catch — an unhandled promise
//    rejection, which Node kills the process on by default. Real Lambda invocations (and
//    serverless-http locally, via sls-offline) are isolated per request, so this was never
//    fatal before; a bare `expressApp.listen()` has no such isolation, and one bad request
//    took the whole dev server down.
//
// Both are pre-existing conditions in application code this migration doesn't touch — but
// local dev needs to keep working exactly as it does today, so this restores both
// behaviors at the process/transport level instead of touching src/libs/express.ts.
import * as http from "http"
import expressApp from "../src/libs/express"

process.on("unhandledRejection", reason => {
  console.error("Unhandled rejection in dev server (request-level, continuing):", reason)
})

function getPort(): number {
  const env = process.env.APP_ENV || "development"
  switch (env) {
    case "development":
    case "pipeline":
    case "testing":
      return 4003
    default:
      return 80
  }
}

const port = getPort()

const server = http.createServer((req, res) => {
  const withBody = req as http.IncomingMessage & { body?: string }
  const chunks: Buffer[] = []
  req.on("data", (chunk: Buffer) => chunks.push(chunk))
  req.on("end", () => {
    if (chunks.length > 0) {
      // Mirrors serverless-http's ServerlessRequest: the raw body string, unparsed.
      withBody.body = Buffer.concat(chunks).toString("utf8")
    }
    expressApp(req, res)
  })
})

server.listen(port, () => {
  console.info(`widget-templates dev server listening on http://127.0.0.1:${port}`)
})
