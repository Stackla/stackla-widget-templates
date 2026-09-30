# Production cutover runbook: Serverless → CDK

Ticket: [UGCPH-563](https://nostosolutions.atlassian.net/browse/UGCPH-563)

This repo deploys exactly one Lambda function, `main` (service `widget-templates`). This
runbook covers cutting that function's deployment mechanism over from Serverless Framework
to the new `cdk/` stack (`WidgetTemplatesStack`).

## Why this is a blue/green cutover, not a full replace

`main` is **not** SQS-triggered. It's exposed via an IAM-authorized **Lambda Function URL**
(`serverless.ts`'s `url: { authorizer: "aws_iam" }`, ported to
`alias.addFunctionUrl({ authType: FunctionUrlAuthType.AWS_IAM })` in `cdk/stack.ts`) —
synchronous request/response, invoked directly per request, with **no queue or retry
buffer** absorbing a cutover gap. The `google-request-worker` reference migration
([UGCPH-550](https://nostosolutions.atlassian.net/browse/UGCPH-550)) argued a full-replace
cutover (delete the old stack, deploy the new one under the same names) is safe *because*
its trigger is SQS — a failed delivery during the gap just gets redelivered once the new
stack is live. That argument does not apply here: a Lambda Function URL's hostname is
generated per Lambda function resource and is **not** stable across a delete-and-recreate,
and there is nothing buffering a request made during the gap between "old deleted" and
"new created" — it just fails.

Per the org's Lambda cutover policy (a Function URL with no other event-source trigger),
this uses **blue/green**: deploy a second CloudFormation stack under distinct names
alongside the still-live original, verify it directly, repoint whoever calls the Function
URL, soak, then delete the old stack. `cdk/stack.ts` supports this via an optional
`nameSuffix` stack prop / `--context nameSuffix=<suffix>` CDK context value (see its
`WidgetTemplatesStackProps` doc comment). Normal deploys (`npm run deploy:<stage>`, used in
steady state and by CI) don't set it and get the canonical names.

### What's actually at risk (and what isn't)

Confirmed via `stackla-infra-terraform/remote/global/content-distribution/cdn-templates.stackla.com.tf`:
production's `templates.stackla.com` CloudFront distribution — the CDN every merchant's
embedded widget loads `layout.hbs`/`tile.hbs`/`widget.css`/`widget.js` from — origins
**exclusively** to the `ugc-nextgen-widgets-{us-east-1,eu-west-1,ap-southeast-2}` S3
buckets, populated by this repo's CI "Release to S3" step (`aws s3 sync dist/ ...
assets/ ...` in `.github/workflows/cdk-deploy/action.yml`), which is **entirely
independent** of the Lambda deploy. No CloudFront distribution anywhere in
`content-distribution/` associates this Lambda as an origin or Lambda@Edge function, and a
workspace-wide search found no other repo/config hardcoding this Lambda's Function URL
either.

**This means: there is no CloudFront config to swap, and a full outage of the `main`
Lambda does not break any live customer widget.** What a cutover gap *does* risk is:

- Template authors/QA using `/preview`, `/dev`, `/docker`, `/multi-preview`, `/staging` to
  build and review widget templates against fixture data, hitting the Function URL
  directly (likely bookmarked, or referenced from the `widget-ui`/authoring tooling per
  `src/libs/express.ts`'s `STAGING_UI_URL`).
- Anything else that happens to call the Function URL directly with IAM credentials.

So: real, but internal-tooling-scoped — not a customer-facing incident. That's what makes
blue/green worthwhile here despite the low blast radius: it turns "an internal tool briefly
502s" into "nothing observable happens," for a small amount of extra process.

## Stack names and regions

| Stage | Steady-state stack (also today's Serverless stack name) | Transitional CDK stack | Region |
|---|---|---|---|
| development | `widget-templates-development` | `widget-templates-development-cutover` | (per `--context region`, default `us-east-1`) |
| staging | `widget-templates-staging` | `widget-templates-staging-cutover` | (per `--context region`) |
| production | `widget-templates-production` | `widget-templates-production-cutover` | (per `--context region`) |

(`cdk/app.ts` derives the CDK stack id and every physical resource name from `stage` +
`nameSuffix`; there is no hardcoded per-stage region map in this repo — see its comment on
why that differs from the `content-api`/`google-request-worker` reference stacks.)

## Pre-flight checklist

1. `npm run build:lambda && npx cdk synth --context stage=<stage> [--context
   region=<region>]` succeeds locally, both with and without `--context
   nameSuffix=-cutover` — confirms both stack shapes synthesize before touching anything
   live.
2. Confirm IAM permissions for: `cdk deploy` (see `cdk/stack.ts` for the resources it
   creates), `cloudformation:DeleteStack` on the old stack, and read access to whatever the
   Function URL fronts today (template-authoring UI config, internal docs/bookmarks) so you
   know who/what to repoint in step 3 below.
3. Identify who currently uses the live Function URL for the target stage — check
   `/aws/lambda/widget-templates-<stage>-main`'s recent invocation activity
   (CloudWatch Logs Insights or Grafana) and, if in doubt, ask in the
   widget-ui/template-authoring channel. Since there's no CloudFront/config file owning
   this pointer (see above), "whoever calls the URL" is the actual thing being cut over —
   identify them concretely rather than assuming nobody's watching.
4. Snapshot the current live Lambda config for reference:
   ```sh
   aws lambda get-function-configuration \
     --function-name widget-templates-<stage>-main \
     --region <region> > /tmp/pre-cutover-<stage>.json
   ```
5. Pick a low-traffic window for the repoint step specifically (steps 1–2 below have zero
   impact on the still-live original and don't need a quiet window — only step 3, actually
   repointing callers, touches anyone's current usage).

## Steps, per stage

Run staging first end-to-end and confirm it's healthy before touching production.

### 1. Deploy the transitional CDK stack (no impact on the live original)

```sh
npm run build:lambda
npx cdk deploy widget-templates-<stage>-cutover \
  --context stage=<stage> --context region=<region> --context nameSuffix=-cutover \
  --require-approval never
```

This creates `widget-templates-<stage>-cutover-main`, its own IAM role, log group,
`live` alias with provisioned concurrency, and its own IAM-authorized Function URL. Nothing
about the live original stack (`widget-templates-<stage>-main`, still on Serverless
Framework, or already-migrated-and-steady-state CDK) is touched — this can be done well
outside any low-traffic window.

### 2. Verify the transitional Lambda directly

First, the bundle itself, in-process (fast, no AWS credentials needed — this is the same
check CI runs on every PR):

```sh
npm run build:lambda
npm run smoke-test:lambda
```

This `require()`s the freshly-bundled `dist-lambda/src/functions/main/handler.js` and
invokes it with a Function-URL-shaped mock event against
`/development/stackla/cs/image/disable` (a static-JSON route with no on-disk template
dependency — see `scripts/smoke-test-lambda.js`'s doc comment for why not `/preview`).
A pass here confirms the bundle boots and serves a request at all, independent of anything
CDK/CloudFormation-specific.

Then exercise the actual deployed transitional Lambda over the network:

```sh
aws lambda get-function --function-name widget-templates-<stage>-cutover-main --region <region>
aws lambda get-function-url-config --function-name widget-templates-<stage>-cutover-main \
  --qualifier live --region <region>
```

The Function URL is `AWS_IAM`-authorized, so a plain `curl` gets `403`. Send a real
SigV4-signed request to it (whatever the team already uses for testing IAM-authorized
Function URLs — e.g. `awscurl`, or a small signed-request script), against both a
static-JSON route and `/preview?widgetType=<any deployed widget>`:

```sh
awscurl --service lambda --region <region> \
  "<function-url>/development/stackla/cs/image/disable"
awscurl --service lambda --region <region> \
  "<function-url>/preview?widgetType=carousel"
```

Confirm: both return `200`, `/preview`'s response looks like a real rendered widget page,
`widget-templates-<stage>-cutover-main`'s new log group shows the requests, and no
unexpected errors appear in that log group.

**Note the pre-existing finding** in
`docs/superpowers/specs/2026-09-24-cdk-migration-design.md` ("Pre-existing finding"): if
`/preview` 500s with an `ENOENT` on a relative-path lookup, that's a pre-existing
application-level bug this migration doesn't fix — not a regression introduced by the
transitional stack. Compare against the still-live original before treating it as a
cutover-blocking issue.

### 3. Repoint whoever calls the Function URL (the actual cutover)

Unlike a customer-facing CDN path, there is no CloudFront origin or other infra config
this repo (or a sibling infra repo) owns to flip. The "repoint" here is communication, not
a config change:

- Send the new Function URL (from step 2's `get-function-url-config`) to whoever you
  identified in the pre-flight checklist (widget-ui/template-authoring team, anyone with
  the old URL bookmarked).
- If the authoring UI (`STAGING_UI_URL` per `src/libs/express.ts`) or any other tool has
  the old Function URL hardcoded in its own config, update it there.
- Do this in the low-traffic window identified in the pre-flight checklist — from this
  point on, people should be pointed at the new URL, but the old one keeps working until
  step 4 deletes it, so this is a soft cutover: both URLs are simultaneously live and
  correct for the duration of the soak below.

### 4. Soak

Monitor `widget-templates-<stage>-cutover-main`'s CloudWatch log group and invocation
metrics for a soak period appropriate to this tool's (low, internal) traffic volume — long
enough to see at least one real template-authoring session hit it, not just the synthetic
checks from step 2. If anything looks wrong, simply keep pointing people at the old
Function URL (still fully live) while investigating — that's the entire rollback, see
below.

### 5. Delete the old stack (safe once step 4 is confirmed healthy)

If the old stack is still Serverless Framework-managed: remove it via `sls remove` (or the
Serverless dashboard) for the target stage. If it's already an earlier steady-state CDK
stack (e.g. redoing a later cutover): `cdk destroy widget-templates-<stage> --context
stage=<stage> --context region=<region>` or `aws cloudformation delete-stack --stack-name
widget-templates-<stage> --region <region>`.

No traffic depends on `widget-templates-<stage>-main` anymore — everyone was repointed in
step 3. This is the point of no return for the old deployment: recovery from here is fixing
forward on the transitional stack, not reverting to the deleted one.

**At this point the cutover is functionally complete and safe to stop.** The
`-cutover`-suffixed names can remain the permanent ones indefinitely — nothing is broken
about that, and stopping here avoids a second repoint entirely. Continue to the optional
steps below only if something concretely depends on the exact canonical name
`widget-templates-<stage>-main` / `widget-templates-<stage>-<region>-lambdaRole` (the
production IAM statements in `cdk/stack.ts` reference `widget-templates-production-main` by
literal ARN, for one) — confirm concretely, don't rename just for tidiness.

### 6–8 (optional). Reclaim the canonical, non-suffixed names

Only do this if something concretely depends on the exact original name. It repeats steps
1–5's shape once more, trading a second (small, controlled) repoint for naming purity:

6. Deploy the steady-state (non-suffixed) stack — safe now, the old stack is gone so
   there's no collision:
   ```sh
   npm run deploy:<stage>
   ```
7. Verify it directly (same as step 2), then repoint callers again to this Function URL, in
   another low-traffic window, with the same monitor-and-be-ready-to-revert posture as step
   3–4. The "revert" target this time is the `-cutover` stack's Function URL, which is
   still live.
8. Once confirmed healthy, delete the transitional stack:
   ```sh
   aws cloudformation delete-stack --stack-name widget-templates-<stage>-cutover --region <region>
   aws cloudformation wait stack-delete-complete --stack-name widget-templates-<stage>-cutover --region <region>
   ```

## Rollback

- **Before step 3 (repointing callers)**: trivial — nothing anyone relies on has changed,
  just don't proceed, or delete the transitional stack.
- **During/after step 3, before step 5**: tell whoever you repointed to go back to the old
  Function URL. The old stack is still fully intact, so this is a complete, fast rollback.
- **After step 5**: the old stack is gone. Roll forward, not back — fix the issue and
  redeploy the transitional (or steady-state) CDK stack; `cdk deploy` is idempotent.
- **During optional steps 6–8**: same shape as step 3/5 — repoint callers back to the
  `-cutover` Function URL (still live until step 8 deletes it), a complete rollback since
  nothing about the transitional stack was touched by steps 6–7.

## What was intentionally NOT changed by this policy update

The IAM statements ported verbatim in `cdk/stack.ts` (staging's `s3:PutBucketTagging`;
production's `lambda:GetFunction`/`EnableReplication*`/`DisableReplication*` on
`widget-templates-production-main`) are **not** suffixed when `nameSuffix` is set — they
stay pointed at the canonical, non-suffixed ARN regardless of which stack is deploying,
matching how the reference migration treats externally-referenced ARNs (e.g.
`content-api`'s SQS queue ARNs) under a blue/green deploy. See `cdk/stack.ts`'s comment on
`PRODUCTION_FUNCTION_ARN` and `cdk/stack.spec.ts`'s "does not suffix the production
self-referencing lambda ARN" test.

## Separately, unrelated to the cutover mechanism itself

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
"Pre-existing finding" section for the full analysis. **Neither this migration nor this
policy update changes that behavior either way** — whatever `/preview` et al. actually do
in real `staging`/`production` today (working or already broken) is what they'll continue
doing after cutover, on both the transitional and steady-state stacks. Worth the owning
team verifying against real staging independently of this migration.
