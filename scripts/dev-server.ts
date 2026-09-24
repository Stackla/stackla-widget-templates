// Local dev/E2E server — replaces `sls offline`. expressApp (src/libs/express.ts) is
// already framework-agnostic; serverless-http (src/functions/main/handler.ts) only wraps
// it for real Lambda event translation, which local dev never needed to round-trip
// through. Port selection mirrors the old serverless.ts's getPort().
import expressApp from "../src/libs/express"

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

expressApp.listen(port, () => {
  console.info(`widget-templates dev server listening on http://127.0.0.1:${port}`)
})
