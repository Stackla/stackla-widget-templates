#!/usr/bin/env node

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

async function startServer() {
  try {
    const { default: expressApp } = await import("./libs/express.js")
    
    // Add basic logging middleware for debugging
    expressApp.use((req, res, next) => {
      console.log(`${new Date().toISOString()} ${req.method} ${req.path}`)
      next()
    })
    
    // Add error handling middleware
    expressApp.use((err, req, res, next) => {
      console.error('Express error:', err)
      res.status(500).send('Internal Server Error')
    })

    expressApp.listen(port, '127.0.0.1', (err) => {
      if (err) {
        console.error('Server failed to start:', err)
        process.exit(1)
      }
      console.log(`🚀 Server running at http://localhost:${port}`)
      console.log(`Preview widgets at: http://localhost:${port}/preview?widgetType=carousel`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()