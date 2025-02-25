const env = process.env.APP_ENV || "development"

const defaultHooks = {
  "before:package:initialize": [`npm run build:${env}`],
  "before:webpack:compile:compile": [`npm run build:${env}`]
}

const plugins = ["serverless-webpack", "serverless-offline", "serverless-hooks-plugin"]

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
  service: "widget-templates",
  provider: {
    name: "aws",
    environment: {
      APP_ENV: env
    },
    stage: "${opt:stage, self:custom.defaultStage}",
    iam: "${file(./config/${self:provider.stage}.json):iam}",
    region: "${opt:region}",
    runtime: "nodejs20.x",
    architecture: "arm64",
    logRetentionInDays: 14,
    deploymentBucket: {
      name: "stackla-serverless-${self:provider.stage}-deploys",
      maxPreviousDeploymentArtifacts: 10,
      blockPublicAccess: true,
      skipPolicySetup: true,
      versioning: true
    }
  },
  plugins,
  custom: {
    defaultStage: "development",
    "serverless-offline": {
      httpPort: getPort()
    },
    esbuild: {
      otherExternal: ["hbs"]
    },
    hooks: process.env.APP_ENV == "testing" ? [] : defaultHooks
  },
  package: {
    include: ["views/**/*", "dist/**/*", "build/**/*"],
    exclude: ["node_modules/**/*"]
  },
  functions: {
    main: {
      handler: "./src/functions/main/handler.main",
      timeout: 30,
      url: {
        authorizer: "aws_iam"
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
      }),
      provisionedConcurrency: 10
    }
  }
}

module.exports = config

