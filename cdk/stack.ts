import * as cdk from "aws-cdk-lib"
import * as iam from "aws-cdk-lib/aws-iam"
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as logs from "aws-cdk-lib/aws-logs"
import { Construct } from "constructs"
import * as path from "path"

interface StageConfig {
  iamStatements: iam.PolicyStatementProps[]
}

const PRODUCTION_FUNCTION_ARN = "arn:aws:lambda:us-east-1:953585160895:function:widget-templates-production-main"

const STAGE_CONFIGS: Record<"development" | "staging" | "production", StageConfig> = {
  development: {
    iamStatements: []
  },
  staging: {
    iamStatements: [
      {
        effect: iam.Effect.ALLOW,
        actions: ["s3:PutBucketTagging"],
        resources: ["*"]
      }
    ]
  },
  production: {
    iamStatements: [
      {
        effect: iam.Effect.ALLOW,
        actions: ["lambda:GetFunction"],
        resources: [PRODUCTION_FUNCTION_ARN]
      },
      {
        effect: iam.Effect.ALLOW,
        actions: ["lambda:EnableReplication*"],
        resources: [PRODUCTION_FUNCTION_ARN]
      },
      {
        effect: iam.Effect.ALLOW,
        actions: ["lambda:EnableReplication*"],
        resources: [`${PRODUCTION_FUNCTION_ARN}:*`]
      },
      {
        effect: iam.Effect.ALLOW,
        actions: ["lambda:DisableReplication*"],
        resources: [PRODUCTION_FUNCTION_ARN]
      },
      {
        effect: iam.Effect.ALLOW,
        actions: ["lambda:DisableReplication*"],
        resources: [`${PRODUCTION_FUNCTION_ARN}:*`]
      }
    ]
  }
}

// Serverless Framework transparently publishes a version + alias to carry
// `provisionedConcurrency`, since AWS Lambda can't apply provisioned concurrency to
// $LATEST. serverless.ts declares this unconditionally (every stage), so it's preserved
// unconditionally here too.
const PROVISIONED_CONCURRENT_EXECUTIONS = 10

export interface WidgetTemplatesStackProps extends cdk.StackProps {
  stage: string
}

export class WidgetTemplatesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: WidgetTemplatesStackProps) {
    super(scope, id, props)

    const { stage } = props
    if (!(stage in STAGE_CONFIGS)) {
      throw new Error(`Unknown stage "${stage}" — expected one of: ${Object.keys(STAGE_CONFIGS).join(", ")}`)
    }
    const config = STAGE_CONFIGS[stage as keyof typeof STAGE_CONFIGS]

    const functionName = `widget-templates-${stage}-main`
    const logGroup = new logs.LogGroup(this, "HandlerLogGroup", {
      logGroupName: `/aws/lambda/${functionName}`,
      retention: logs.RetentionDays.TWO_WEEKS,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })

    const role = new iam.Role(this, "HandlerServiceRole", {
      // Matches the actual deployed role name (Fn::Join with region) so nothing that
      // references the role by name breaks on cutover.
      roleName: `widget-templates-${stage}-${this.region}-lambdaRole`,
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole")]
    })
    for (const statement of config.iamStatements) {
      role.addToPolicy(new iam.PolicyStatement(statement))
    }

    const fn = new lambda.Function(this, "Handler", {
      // Matches the actual deployed function name (Serverless Framework's function was
      // named "main" under service "widget-templates") so the Lambda ARN and log group
      // path don't change on cutover.
      functionName,
      role,
      code: lambda.Code.fromAsset(path.join(__dirname, "../dist-lambda")),
      handler: "src/functions/main/handler.main",
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      timeout: cdk.Duration.seconds(30),
      // Serverless Framework defaults memorySize to 1024 when unset (neither
      // serverless.ts nor config/*.json override it) — this is what's actually running
      // in production today.
      memorySize: 1024,
      logGroup,
      environment: {
        APP_ENV: stage
      }
    })

    const alias = new lambda.Alias(this, "LiveAlias", {
      aliasName: "live",
      version: fn.currentVersion,
      provisionedConcurrentExecutions: PROVISIONED_CONCURRENT_EXECUTIONS
    })

    // The Function URL must live on the alias, not the bare function — provisioned
    // concurrency only applies to the published version/alias, and the Function URL has
    // to point at that same target or the provisioned-concurrency config is a no-op.
    alias.addFunctionUrl({ authType: lambda.FunctionUrlAuthType.AWS_IAM })
  }
}
