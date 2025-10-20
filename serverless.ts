const env = process.env.APP_ENV || "development";

const defaultHooks = {
  "before:package:initialize": [`npm run build:${env}`],
  "before:webpack:compile:compile": [`npm run build:${env}`]
};

const plugins = [
  "serverless-webpack",
  "serverless-offline",
  "serverless-hooks-plugin"
];

const getPort = () => {
  switch (env) {
    case "development":
    case "pipeline":
      return 4003;
    case "testing":
      return 4002;
    default:
      return 80;
  }
};

const getHooks = (env: string) => {
  switch (env) {
    case "testing":
      return {};
    case "development":
      return {};
    case "pipeline":
      return {
        "before:package:initialize": [`npm run build:${env}`],
        "before:offline:start:init": [`npm run build:${env}`]
      };
    default:
      return {
        "before:package:initialize":
          "npm run build:${sls:stage} && npm run build:local && npm run build:external-testing && npm run generate:docs",
        "before:offline:start:init":
          "npm run build:${sls:stage} && npm run build:local && npm run build:external-testing && npm run build:development && npm run generate:docs"
      };
  }
}

const config = {
  service: "widget-templates",
  provider: {
    name: "aws",
    environment: {
      APP_ENV: env
    },
    stage: '${opt:stage, self:custom.defaultStage}',
    iam: '${file(./config/${self:provider.stage}.json):iam}',
    region: '${opt:region}',
    runtime: 'nodejs20.x',
    architecture: 'arm64',
    logRetentionInDays: 14,
    deploymentBucket: {
        name: 'stackla-serverless-${self:provider.stage}-deploys',
        maxPreviousDeploymentArtifacts: 10,
        blockPublicAccess: true,
        skipPolicySetup: true,
        versioning: true,
    },
  },
  plugins,
  custom: {
    defaultStage: 'development',
    'serverless-offline': {
      httpPort: getPort()
    },
    esbuild: {
      otherExternal: ["hbs"]
    },
    hooks: getHooks(process.env.APP_ENV || "development")
  },
  package: {
    include: ["views/**/*", "dist/**/*", "build/**/*", "assets/**/*"],
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
};

module.exports = config;