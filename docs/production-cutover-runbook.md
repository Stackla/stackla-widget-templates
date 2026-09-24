# Production Cutover Runbook: Serverless Framework → CDK

Ticket: [UGCPH-563](https://nostosolutions.atlassian.net/browse/UGCPH-563)

This repo deploys exactly one Lambda function, `main` (service `widget-templates`). This
runbook covers cutting that function's deployment mechanism over from Serverless Framework
to the new `cdk/` stack (`WidgetTemplatesStack`).

## Trigger analysis (read this before deploying)

`main` is **not** SQS-triggered. It's exposed via an IAM-authorized **Lambda Function URL**
(`serverless.ts`'s `url: { authorizer: "aws_iam" }`, ported to
`alias.addFunctionUrl({ authType: FunctionUrlAuthType.AWS_IAM })` in `cdk/stack.ts`) —
synchronous request/response, invoked directly per-request, with **no queue or retry
buffer** absorbing a cutover gap. The `google-request-worker` reference migration
([UGCPH-550](https://nostosolutions.atlassian.net/browse/UGCPH-550)) argued a full-replace
cutover is safe *because* its trigger is SQS (a failed delivery during the cutover window
just gets redelivered once the new stack is live). **That argument does not apply here.**

### What's actually at risk

Confirmed via `stackla-infra-terraform/remote/global/content-distribution/cdn-templates.stackla.com.tf`:
production's `templates.stackla.com` CloudFront distribution — the CDN every merchant's
embedded widget loads `layout.hbs`/`tile.hbs`/`widget.css`/`widget.js` from — origins
**exclusively** to the `ugc-nextgen-widgets-{us-east-1,eu-west-1,ap-southeast-2}` S3
buckets, populated by this repo's CI "Release to S3" step (`aws s3 sync dist/ ...
assets/ ...` in `.github/workflows/cdk-deploy/action.yml`), which is **entirely
independent** of the Lambda deploy. No CloudFront distribution anywhere in
`content-distribution/` associates this Lambda as an origin or Lambda@Edge function.

**This means: a full outage of the `main` Lambda does not break any live customer widget.**
What it *does* break, for the duration of any gap:

- Template authors/QA using `/preview`, `/dev`, `/docker`, `/multi-preview`, `/staging` to
  build and review widget templates against fixture data (via the Function URL, likely
  fronted by the `widget-ui`/authoring tooling referenced in `src/libs/express.ts`'s
  `STAGING_UI_URL`).
- Anything else that happens to call the Function URL directly with IAM credentials.

So: real, but internal-tooling-scoped — not a customer-facing incident.

### The actual gap

A Lambda Function URL's hostname is generated per Lambda function resource — it is **not**
stable across a delete-and-recreate. Deploying `cdk/stack.ts` for the first time in a given
stage creates a **new** CloudFormation stack alongside the existing Serverless Framework
one; both can't own a Lambda function with the same `functionName` at once (`widget-templates-${stage}-main`
is used by both). The practical sequence for each stage's actual cutover is:

1. Delete the Serverless Framework stack (`sls remove` or via the Serverless dashboard),
   freeing the `widget-templates-${stage}-main` function name and tearing down its
   Function URL.
2. Deploy the CDK stack (`cdk deploy --context stage=<x> --context region=<x>`), which
   creates a **new** Function URL (a new hostname).

Between steps 1 and 2, `main`'s Function URL does not exist at all — any request in that
window gets a hard connection failure, not a queued/retried one.

## Mitigation

1. **Do the cutover in a defined low-traffic window**, and give the widget-ui/template-authoring
   team advance notice — anyone actively mid-`/preview` during the gap gets a failed
   request with no automatic retry.
2. **Capture the new Function URL immediately after `cdk deploy` completes**
   (`aws lambda get-function-url-config --function-name widget-templates-<stage>-main
   --qualifier live`, or read it from the `cdk deploy` output) and update it wherever it's
   referenced by name (any hardcoded Function URL in the authoring UI's config, browser
   bookmarks, etc. — this repo's own code doesn't hardcode it anywhere, since
   `src/libs/express.ts` never calls out to its own Function URL, but anything *external*
   that does needs updating). This is the step most likely to be missed, since nothing in
   CI verifies it automatically.
3. **Validate before declaring done**: immediately after deploy, `curl` the new Function
   URL's `/development/stackla/cs/image/disable` route (a static JSON response with no
   on-disk template dependency — see `scripts/smoke-test-lambda.js`'s doc comment for why
   that specific route, not `/preview`, is the right one for a fast, reliable check) with a
   SigV4-signed request. Only treat the cutover as complete once this returns `200`.
4. **Fast rollback path**: keep the just-deleted Serverless Framework deployment artifacts
   (the last successful `sls deploy` state) available so `sls deploy --stage <x> --region
   <x>` can be re-run to restore service if the CDK stack fails to come up. This is a
   manual, deliberate step — there's no automatic rollback wired up.
5. **Longer-term follow-up (not implemented in this PR):** front the Function URL with a
   stable custom domain (API Gateway custom domain, or a small internal CloudFront
   distribution) so future infra changes don't require updating a hardcoded URL anywhere.
   Out of scope here — this PR only migrates the deploy mechanism.

## Separately, unrelated to the cutover itself

`getContent()` in `src/libs/express.ts` (used by `/preview`, `/dev`, `/docker`,
`/multi-preview`, `/staging`) resolves `dist/<widgetType>` via a relative path
(`../../../../../dist`) whose correctness depends on exactly how deep the compiled handler
sits below wherever `dist/` lives in the deployed package. This migration's
`scripts/build-lambda.js` reproduces `serverless.ts`'s **declared** `package.include`
layout (`dist/`/`views/`/`assets/` as direct package-root siblings, handler 3 levels
deep) — the same structure real `sls deploy` almost certainly ships too, based on
`serverless.ts`'s own configuration, even though this differs from the depth verified
working under local `sls offline` (which runs the compiled handler in place inside the
repo checkout, an extra 2 levels of `server/service/` nesting that a real deploy's zip
doesn't have). See `docs/superpowers/specs/2026-09-24-cdk-migration-design.md`'s
"Pre-existing finding" section for the full analysis. **This migration does not change that
behavior either way** — whatever `/preview` et al. actually do in real `staging`/`production`
today (working or already broken) is what they'll continue doing after cutover. Worth the
owning team verifying against real staging independently of this migration.
