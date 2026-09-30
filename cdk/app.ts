import * as cdk from "aws-cdk-lib"
import { WidgetTemplatesStack } from "./stack"

const app = new cdk.App()
const stage: string = app.node.tryGetContext("stage") ?? "development"
// Only set for a transitional blue/green cutover deploy — see
// docs/production-cutover-runbook.md. Empty for normal deploys, which get the canonical
// `widget-templates-<stage>-*` resource names.
const nameSuffix: string = app.node.tryGetContext("nameSuffix") ?? ""

// serverless.ts's own region was always `${opt:region}` — purely CLI-supplied, with no
// baked-in default per stage — and config/*.json encode no per-stage region (unlike
// google-request-worker's queue/SNS ARNs). Resolving region from context/env at
// synth/deploy time is the more faithful port here than hardcoding a stage->region map.
const region: string =
  app.node.tryGetContext("region") ?? process.env.AWS_REGION ?? process.env.CDK_DEFAULT_REGION ?? "us-east-1"

// Reuses the same S3 bucket Serverless Framework already deploys to, with the deployer's
// own credentials — avoids a separate CDK bootstrap step/permission set.
const synthesizer = new cdk.CliCredentialsStackSynthesizer({
  fileAssetsBucketName: `stackla-serverless-${stage}-deploys`,
  bucketPrefix: "cdk-assets/"
})

const stack = new WidgetTemplatesStack(app, `widget-templates-${stage}${nameSuffix}`, {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region },
  stage,
  nameSuffix,
  synthesizer
})

cdk.Tags.of(stack).add("cdk", "true")
app.synth()
