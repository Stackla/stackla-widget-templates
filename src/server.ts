#!/usr/bin/env node

import expressApp from "./libs/express"

const getPort = () => {
  const env = process.env.APP_ENV || "development"
  switch (env) {
    case "development":
      return 4003;
    case "testing":
      return 4002;
    default:
      return 4003;
  }
}

const port = getPort()
const env = process.env.APP_ENV || "development"

console.log(`Starting Stackla Widget Templates server...`)
console.log(`Environment: ${env}`)
console.log(`Port: ${port}`)

expressApp.listen(port, '127.0.0.1', () => {
  console.log(`🚀 Server running at http://localhost:${port}`)
  console.log(`Preview widgets at: http://localhost:${port}/preview?widgetType=carousel`)
})

export default expressApp