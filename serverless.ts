const env = process.env.APP_ENV || "development";
const LAMBDA_AT_EDGE = "us-east-1";
const STAGING = "us-west-1";

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
      return 4003;
    case "testing":
      return 4002;
    default:
      return 80;
  }
};

const getEnv = () => {
  return env === "production" ? LAMBDA_AT_EDGE : STAGING;
}

const getDeploymentBucketName = () => {
  return env === "production" ? 
   `edge-lambdas-staging-serverlessdeploymentbucket-kw4rvbxarbxt` :
   `stackla-serverless-${env}-deploys`;
}

const config = {
  service: "widget-templates",
  provider: {
    name: "aws",
    stage: '${opt:stage, self:custom.defaultStage}',
    iam: '${file(./config/${self:provider.stage}.json):iam}',
    region: getEnv(),
    deploymentBucket: {
        name: `${getDeploymentBucketName()}`,
        maxPreviousDeploymentArtifacts: 10,
        blockPublicAccess: true,
        skipPolicySetup: true,
        versioning: true,
    },
  },
  resources: {
    Resources: {
      IamRoleLambdaExecution: {
        Type: 'AWS::IAM::Role',
        Properties: {
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  Service: ['lambda.amazonaws.com', 'edgelambda.amazonaws.com'],
                },
                Action: 'sts:AssumeRole',
              },
            ],
          },
        },
      },
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
    hooks: process.env.APP_ENV == 'testing' ? [] : defaultHooks
  },
  package: {
    include: ["views/**/*", "dist/**/*", "build/**/*"],
    exclude: ["node_modules/**/*"]
  },
  functions: {
    main: {
      handler: "./src/functions/main/handler.main",
      timeout: 5,
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
      memorySize: process.env.APP_ENV === 'production' ? 128 : 1024,
      // Lambda @ Edge in production does not support provisioned concurrency
      provisionedConcurrency: process.env.APP_ENV === "staging" ? 1 : 0
    }
  }
};

module.exports = config;
