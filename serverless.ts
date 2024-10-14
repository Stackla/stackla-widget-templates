const { serverlessConfig } = require("@stackla/base-serverless")

const env = process.env.APP_ENV || "development"

const testingHooks = {
  "before:package:initialize": ["npm run test:build"],
  "before:offline:start:init": ["npm run test:build"],
  "before:webpack:compile:compile": ["npm run test:build"]
}

const defaultHooks = {
  "before:package:initialize": [`APP_ENV=${env} npm run build`],
  "before:webpack:compile:compile": [`APP_ENV=${env} npm run build`]
}

const plugins: string[] = ["serverless-webpack", "serverless-offline", "serverless-hooks-plugin"]

const getPort = () => {
  switch (env) {
    case "development":
      return 4003
    case "testing":
      return 4002
    default:
      return 80
  }
}

const config = {
  ...serverlessConfig({
    plugins: plugins,
    service: "widget-templates",
    offlinePort: getPort(),
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
      environment: {
        APP_ENV: env
      },
      handler: `./src/functions/main/handler.main`,
      timeout: 30,
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
