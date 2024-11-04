const env = process.env.APP_ENV || "development";

const testingHooks = {
  "before:package:initialize": ["npm run test:build"],
  "before:offline:start:init": ["npm run test:build"],
  "before:webpack:compile:compile": ["npm run test:build"]
};

const defaultHooks = {
  "before:package:initialize": [`APP_ENV=${env} npm run build`],
  "before:webpack:compile:compile": [`APP_ENV=${env} npm run build`]
};

const plugins = [
  "serverless-webpack",
  "serverless-offline",
  "serverless-hooks-plugin"
];

const getPort = () => {
  switch (env) {
    case "development":
      return 4003;
    case "testing":
      return 4002;
    default:
      return 80;
  }
};

const config = {
  service: "widget-templates",
  provider: {
    name: "aws",
    environment: {
      APP_ENV: env
    }
  },
  plugins,
  custom: {
    'serverless-offline': {
      httpPort: getPort()
    },
    esbuild: {
      otherExternal: ["hbs"]
    },
    hooks: env === "testing" ? testingHooks : defaultHooks
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
      })
    }
  },
  resources: {
    Resources: {
      CloudfrontPermissionGrant: {
        Type: 'AWS::Lambda::Permission',
        Properties: {
          Action: 'lambda:InvokeFunctionUrl',
          FunctionName: {
            Ref: 'MainLambdaFunction',
          },
          Principal: 'cloudfront.amazonaws.com',
          SourceArn:
            '${file(./config/${self:provider.stage}.json):cloudfront.sourceArn}' as any,
        },
      },
    },
  },
};

module.exports = config;
