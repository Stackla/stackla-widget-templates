const core = require("@actions/core")
const fs = require("fs")

try {
  const path = core.getInput("path")
  const exists = fs.existsSync(`${path}/node_modules/@stackla/ugc-widgets/dist`)
  core.debug(`Result is ${exists} for source check`)
  core.setOutput("distAvailable", exists)
} catch (error) {
  core.setFailed(error.message)
}
