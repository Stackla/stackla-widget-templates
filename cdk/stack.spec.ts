import { App } from "aws-cdk-lib"
import { Match, Template } from "aws-cdk-lib/assertions"
import * as fs from "fs"
import * as path from "path"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { WidgetTemplatesStack } from "./stack"

const distLambdaDir = path.resolve(__dirname, "../dist-lambda")
const handlerDir = path.join(distLambdaDir, "src/functions/main")

beforeAll(() => {
  fs.mkdirSync(handlerDir, { recursive: true })
  fs.writeFileSync(path.join(handlerDir, "handler.js"), "exports.main = async () => {};")
})

afterAll(() => {
  fs.rmSync(distLambdaDir, { recursive: true, force: true })
})

function synthStack(stage: string, region = "us-west-1", nameSuffix = "") {
  const app = new App()
  const stack = new WidgetTemplatesStack(app, `test-${stage}${nameSuffix}`, {
    env: { account: "123456789012", region },
    stage,
    nameSuffix
  })
  return Template.fromStack(stack)
}

function getFunctionProperties(template: Template) {
  template.resourceCountIs("AWS::Lambda::Function", 1)
  const [, fn] = Object.entries(template.findResources("AWS::Lambda::Function"))[0]
  return fn.Properties
}

describe("WidgetTemplatesStack", () => {
  it("throws for an unrecognized stage", () => {
    expect(() => synthStack("typo-stage")).toThrow(/Unknown stage/)
  })

  it("configures the Lambda function runtime, architecture, handler, timeout, and memory", () => {
    const template = synthStack("staging")

    template.hasResourceProperties("AWS::Lambda::Function", {
      Runtime: "nodejs20.x",
      Architectures: ["arm64"],
      Handler: "src/functions/main/handler.main",
      Timeout: 30,
      MemorySize: 1024
    })
  })

  it("names the function and log group to match the live Serverless deployment", () => {
    const template = synthStack("staging")

    const props = getFunctionProperties(template)
    expect(props.FunctionName).toBe("widget-templates-staging-main")

    template.hasResourceProperties("AWS::Logs::LogGroup", {
      LogGroupName: "/aws/lambda/widget-templates-staging-main",
      RetentionInDays: 14
    })
  })

  it("names the IAM role to match the live deployment (region-qualified)", () => {
    const template = synthStack("staging", "us-west-1")

    template.hasResourceProperties("AWS::IAM::Role", {
      RoleName: "widget-templates-staging-us-west-1-lambdaRole"
    })
  })

  it("sets APP_ENV to the stage and does not attach a VPC", () => {
    for (const stage of ["development", "staging", "production"]) {
      const template = synthStack(stage)
      const props = getFunctionProperties(template)

      expect(props.Environment.Variables.APP_ENV).toBe(stage)
      expect(props.VpcConfig).toBeUndefined()
    }
  })

  it("does not grant extra IAM statements in development", () => {
    const template = synthStack("development")

    template.resourcePropertiesCountIs(
      "AWS::IAM::Policy",
      Match.objectLike({
        PolicyDocument: Match.objectLike({
          Statement: Match.arrayWith([Match.objectLike({ Action: Match.stringLikeRegexp("^s3:|^lambda:") })])
        })
      }),
      0
    )
  })

  it("grants s3:PutBucketTagging on all resources in staging", () => {
    const template = synthStack("staging")

    template.hasResourceProperties("AWS::IAM::Policy", {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: "Allow",
            Action: "s3:PutBucketTagging",
            Resource: "*"
          })
        ])
      })
    })
  })

  it("grants the replication-management lambda statements on the function's own ARN in production", () => {
    const template = synthStack("production")

    const selfArn = "arn:aws:lambda:us-east-1:953585160895:function:widget-templates-production-main"

    template.hasResourceProperties("AWS::IAM::Policy", {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({ Effect: "Allow", Action: "lambda:GetFunction", Resource: selfArn }),
          Match.objectLike({ Effect: "Allow", Action: "lambda:EnableReplication*", Resource: selfArn }),
          Match.objectLike({ Effect: "Allow", Action: "lambda:EnableReplication*", Resource: `${selfArn}:*` }),
          Match.objectLike({ Effect: "Allow", Action: "lambda:DisableReplication*", Resource: selfArn }),
          Match.objectLike({ Effect: "Allow", Action: "lambda:DisableReplication*", Resource: `${selfArn}:*` })
        ])
      })
    })
  })

  // Provisioned concurrency is declared unconditionally in serverless.ts (every stage,
  // including development) and AWS Lambda can't apply it to $LATEST — Serverless
  // Framework transparently publishes a version + alias to carry it. This must be
  // replicated exactly or the setting is a silent no-op.
  it.each(["development", "staging", "production"])(
    "publishes a 'live' alias with provisioned concurrency 10 in %s",
    stage => {
      const template = synthStack(stage)

      template.hasResourceProperties("AWS::Lambda::Alias", {
        Name: "live",
        ProvisionedConcurrencyConfig: {
          ProvisionedConcurrentExecutions: 10
        }
      })
    }
  )

  // AWS::Lambda::Url binds to an alias via TargetFunctionArn (the underlying function)
  // plus a separate Qualifier naming the alias — not a Ref to the alias resource itself.
  // Qualifier: "live" is what actually routes traffic through the provisioned-concurrency
  // alias instead of $LATEST; asserting it directly is the load-bearing check here.
  it.each(["development", "staging", "production"])(
    "binds the IAM-authorized function URL to the 'live' alias (not $LATEST) in %s",
    stage => {
      const template = synthStack(stage)

      template.hasResourceProperties("AWS::Lambda::Url", {
        AuthType: "AWS_IAM",
        Qualifier: "live"
      })
    }
  )

  // Blue/green cutover support (docs/production-cutover-runbook.md): a transitional
  // stack must deploy under distinct physical names so it can coexist with the
  // still-live steady-state stack, but must otherwise behave identically — same alias
  // name, same provisioned concurrency, same Function URL wiring, same IAM statements.
  describe("with nameSuffix set (transitional blue/green stack)", () => {
    it("suffixes the function name, role name, and log group name", () => {
      const template = synthStack("staging", "us-west-1", "-cutover")

      const props = getFunctionProperties(template)
      expect(props.FunctionName).toBe("widget-templates-staging-cutover-main")

      template.hasResourceProperties("AWS::IAM::Role", {
        RoleName: "widget-templates-staging-cutover-us-west-1-lambdaRole"
      })

      template.hasResourceProperties("AWS::Logs::LogGroup", {
        LogGroupName: "/aws/lambda/widget-templates-staging-cutover-main",
        RetentionInDays: 14
      })
    })

    it("defaults to no suffix (canonical names) when nameSuffix is omitted", () => {
      const template = synthStack("staging")

      const props = getFunctionProperties(template)
      expect(props.FunctionName).toBe("widget-templates-staging-main")
    })

    it.each(["development", "staging", "production"])(
      "still publishes a 'live' alias with provisioned concurrency 10 in %s",
      stage => {
        const template = synthStack(stage, "us-west-1", "-cutover")

        template.hasResourceProperties("AWS::Lambda::Alias", {
          Name: "live",
          ProvisionedConcurrencyConfig: {
            ProvisionedConcurrentExecutions: 10
          }
        })
      }
    )

    it.each(["development", "staging", "production"])(
      "still binds the IAM-authorized function URL to the 'live' alias (not $LATEST) in %s",
      stage => {
        const template = synthStack(stage, "us-west-1", "-cutover")

        template.hasResourceProperties("AWS::Lambda::Url", {
          AuthType: "AWS_IAM",
          Qualifier: "live"
        })
      }
    )

    it("does not suffix the production self-referencing lambda ARN in its IAM statements", () => {
      // PRODUCTION_FUNCTION_ARN is a literal, ported-as-is string (see cdk/stack.ts) —
      // it must stay pointed at the canonical, non-suffixed production function
      // regardless of nameSuffix, matching how the reference migration treats
      // externally-referenced ARNs (e.g. queueArns) under a blue/green deploy.
      const template = synthStack("production", "us-east-1", "-cutover")

      const selfArn = "arn:aws:lambda:us-east-1:953585160895:function:widget-templates-production-main"

      template.hasResourceProperties("AWS::IAM::Policy", {
        PolicyDocument: Match.objectLike({
          Statement: Match.arrayWith([
            Match.objectLike({ Effect: "Allow", Action: "lambda:GetFunction", Resource: selfArn })
          ])
        })
      })
    })

    it("still grants s3:PutBucketTagging on all resources in staging", () => {
      const template = synthStack("staging", "us-west-1", "-cutover")

      template.hasResourceProperties("AWS::IAM::Policy", {
        PolicyDocument: Match.objectLike({
          Statement: Match.arrayWith([
            Match.objectLike({
              Effect: "Allow",
              Action: "s3:PutBucketTagging",
              Resource: "*"
            })
          ])
        })
      })
    })
  })
})
