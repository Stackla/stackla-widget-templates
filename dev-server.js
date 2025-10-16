#!/usr/bin/env node

/**
 * Standalone development server for widget templates
 * Replaces serverless-offline for local development
 */

// Use jiti to load TypeScript files
const jiti = require('jiti')(__filename);

// Load the express app, handling both default and named exports
const expressModule = jiti("./src/libs/express.ts");
const expressApp =
  (typeof expressModule === "function" && typeof expressModule.listen === "function")
    ? expressModule
    : (expressModule && typeof expressModule.default === "function" && typeof expressModule.default.listen === "function")
      ? expressModule.default
      : null;

if (!expressApp) {
  console.error(
    "\n❌ Failed to load Express app from './src/libs/express.ts'.\n" +
    "Make sure the module exports an Express app either as a default export or as a named export.\n"
  );
  process.exit(1);
}
const env = process.env.APP_ENV || "development";
const NODE_ENV = process.env.NODE_ENV || "development";

/**
 * Get the port based on the environment
 */
const getPort = () => {
  switch (env) {
    case "development":
    case "pipeline":
      return 4003;
    case "testing":
      return 4002;
    default:
      return 4003;
  }
};

const PORT = process.env.PORT || getPort();
const HOST = process.env.HOST || "127.0.0.1";

/**
 * Start the Express server
 */
const startServer = () => {
  const server = expressApp.listen(PORT, HOST, () => {
    console.log("\n" + "=".repeat(60));
    console.log(`🚀 Widget Templates Server Running`);
    console.log("=".repeat(60));
    console.log(`Environment: ${env}`);
    console.log(`Node Environment: ${NODE_ENV}`);
    console.log(`Server: http://${HOST}:${PORT}`);
    console.log(`Preview: http://${HOST}:${PORT}/preview?widgetType=carousel`);
    console.log("=".repeat(60) + "\n");
  });

  // Handle shutdown gracefully
  const shutdown = (signal) => {
    console.log(`\n${signal} received, shutting down gracefully...`);
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error("Forcing shutdown after timeout");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Handle errors
  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`\n❌ Port ${PORT} is already in use. Please free the port or set a different PORT environment variable.\n`);
    } else {
      console.error("\n❌ Server error:", error);
    }
    process.exit(1);
  });

  return server;
};

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = { startServer, getPort };
