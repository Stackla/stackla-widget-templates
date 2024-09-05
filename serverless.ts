const { serverlessConfig } = require("@stackla/base-serverless")
const { handlerPath } = require("@stackla/lambda-api-bootstrap")

const env = process.env.APP_ENV || "development"

const testingHooks = {
  "before:package:initialize": ["npm run dev"],
  "before:offline:start:init": ["npm run dev"],
  "before:webpack:compile:compile": ["npm run dev"]
}

const defaultHooks = {
  "before:package:initialize": [`APP_ENV=${env} npm run build`],
  "before:webpack:compile:compile": [`APP_ENV=${env} npm run build`]
}

const plugins: string[] = ["serverless-webpack", "serverless-offline", "serverless-hooks-plugin"]

const config = {
  ...serverlessConfig({
    plugins: plugins,
    service: "widget-templates",
    offlinePort: process.env.APP_ENV == "testing" ? 4003 : 80,
    custom: {
      esbuild: {
        otherExternal: ["hbs"]
      },
      hooks: process.env.APP_ENV == "testing" ? testingHooks : defaultHooks
    },
    package: {
      include: ["views/**/*", "dist/**/*", "build/**/*"],
      exclude: ["node_modules/**/*"]
    }
  }),
  functions: {
    main: {
      handler: `./src/functions/main/handler.main`,
      timeout: 30,
      provisionedConcurrency: 10,
      url: {
        authorizer: "aws_iam" as const
      },
      ...(process.env.NODE_ENV === "development" && {
        events: [
          {
            http: {
              method: "any",
              path: "/{proxy+}"
            }
          }
        ]
      })
    }
  }
}

module.exports = config
