# Migrate stackla-widget-templates from Serverless Framework to CDK

Ticket: [UGCPH-563](https://nostosolutions.atlassian.net/browse/UGCPH-563)

## Context

`stackla-widget-templates` is primarily a template-definitions repo (SCSS/TSX/Handlebars
widget templates, compiled with esbuild into `dist/` and pushed to S3/CloudFront for
customer-facing delivery). It also deploys exactly **one** Lambda function, `main`
(`serverless.ts`), which is an Express app (`src/libs/express.ts`, wrapped by
`serverless-http` in `src/functions/main/handler.ts`) exposing:

- `/preview`, `/dev`, `/docker`, `/multi-preview`, `/staging` — server-rendered HTML
  pages (Handlebars) that render a widget template live against fixture data, used by
  template authors/QA while building widgets.
- A handful of `/development/...` mock-data and product-fixture endpoints.
- Static serving of `dist/` and `assets/`.

Deployment today (`.github/workflows/serverless/action.yml`): `sls deploy` (packaged via
`serverless-webpack`), then, **independently**, `aws s3 sync dist/ ... assets/ ...` to
`s3://ugc-nextgen-widgets-ap-southeast-2/templates/${stage}/widgets/`, then a Sentry
release.

`google-request-worker`'s CDK migration ([UGCPH-550](https://nostosolutions.atlassian.net/browse/UGCPH-550),
checked out locally) is the reference pattern for this org's second-ever CDK-based Lambda
deploy (after `stackla-node-lambda/serverless/visual-recognition/cdk/`, the first). It does
not solve two problems specific to *this* migration: this app isn't NestJS (no decorator
bundling to worry about, so CDK's `NodejsFunction` esbuild-CLI bundler is usable as-is —
unlike the reference which needed a hand-rolled esbuild script for `@anatine/esbuild-decorators`),
and the trigger is not SQS — it's a synchronous HTTP request via a Lambda Function URL.

## Critical trigger finding: this Lambda is *not* in the customer-facing widget path

`serverless.ts`'s `functions.main` has no `events:` SQS/S3/etc trigger. It's exposed via
`url: { authorizer: "aws_iam" }` — an IAM-authorized **Lambda Function URL**, invoked
synchronously per request — plus, only when `NODE_ENV === "development"` (i.e. only under
`sls offline`, never in a real deploy), an API Gateway `any /{proxy+}` event for local
testing.

Verified via `stackla-infra-terraform/remote/global/content-distribution/cdn-templates.stackla.com.tf`:
production's `templates.stackla.com` CloudFront distribution — the CDN every merchant's
embedded widget actually loads `layout.hbs`/`tile.hbs`/`widget.css`/`widget.js` from — has
its origins set **exclusively** to the `ugc-nextgen-widgets-{us-east-1,eu-west-1,ap-southeast-2}`
S3 buckets (`origin_path = "/templates/production/widgets"`). No `lambda_function_association`
anywhere in `content-distribution/` references this function (that block only appears on
unrelated ingestion/webhook API distributions), and no CloudFront distribution proxies to
this Lambda's Function URL. Those S3 buckets are populated by this repo's CI "Release to
S3" step, which is entirely decoupled from the Serverless/CDK Lambda deploy.

**Conclusion:** this Lambda's Function URL only serves internal template-authoring/preview
tooling (and local dev fixtures) — not production merchant-facing widget rendering. A full
outage of this Lambda does not break any live customer widget. It's still a genuine
synchronous HTTP endpoint with real (if lower-blast-radius) users, and unlike SQS it has
no retry/buffer — see "Cutover risk" below, expanded on in `docs/production-cutover-runbook.md`.

## Architecture

New `cdk/` directory at the repo root replaces `serverless.ts`:

- `cdk/app.ts` — creates the CDK `App`, resolves `stage` from `--context stage=<x>`
  (default `development`) and `region` from `--context region=<x>` (falling back to
  `process.env.AWS_REGION`/`process.env.CDK_DEFAULT_REGION`, default `us-east-1`).
  Unlike the reference, this repo's `config/*.json` encode no per-stage region mapping
  (no queue/SNS ARNs) — the only region-specific hint is `config/production.json`'s
  self-referencing Lambda ARN, `arn:...:us-east-1:...:function:widget-templates-production-main`,
  which is ported as a literal string, not derived. `serverless.ts`'s own region was
  always `${opt:region}` (purely CLI-supplied, no baked-in default), so resolving region
  from context/env at synth/deploy time — rather than hardcoding a `REGION_BY_STAGE` map
  like the reference — is the more faithful port here. Uses
  `CliCredentialsStackSynthesizer` pointed at the existing
  `stackla-serverless-${stage}-deploys` S3 bucket (`bucketPrefix: 'cdk-assets/'`), same as
  the reference — reuses the CI deployer's existing IAM identity/bucket permissions, no
  CDK bootstrap required.
- `cdk/stack.ts` — `WidgetTemplatesStack`, hand-written (no shared CDK construct package
  exists in the org).
- `cdk/tsconfig.json` — a dedicated Node/CommonJS tsconfig for `cdk/*.ts`. The repo's root
  `tsconfig.json` targets browser widget bundles (`lib: ["DOM"]` only, no base JS lib, no
  `include` for `src/**` or `cdk/**`) and is unsuitable for Node infra code. `cdk/` gets
  its own tsconfig (`lib: ["ES2022"]`, `module: "commonjs"`, `types: ["node"]`) and its own
  `npm run typecheck:cdk` script, folded into `npm run typecheck`.

## Lambda bundling

Unlike `google-request-worker`, this app has no NestJS decorator metadata to preserve, so
CDK's `NodejsFunction` (esbuild-CLI bundling) would normally be usable directly. It isn't
used here anyway, for one repo-specific reason: `getContent()` in `src/libs/express.ts`
reads `views/*.hbs` and `dist/<widgetType>/{layout,tile}.hbs`/`widget.{css,js}` from disk
at runtime via `fs.readFileSync` — non-JS assets that no JS bundler pulls in automatically.
The existing `serverless-webpack` pipeline handles this today via `CopyWebpackPlugin`
(`{from: "views", to: "views"}`, `{from: "dist", to: "dist"}`) plus `serverless.ts`'s own
`package.include: ["views/**/*", "dist/**/*", "build/**/*", "assets/**/*"]`.

Decision: add `scripts/build-lambda.js`, calling esbuild's Node API directly:

- Bundle `src/functions/main/handler.ts` to `dist-lambda/src/functions/main/handler.js`
  (`outfile`, not `outdir`, to preserve the exact same relative nesting the deployed
  Serverless package has today — `getContent()`'s relative-path arithmetic in
  `express.ts` depends on `handler.js`'s depth from the deployment root being unchanged;
  this migration ports deployment infra, it does not touch/fix application code).
  `bundle: true`, `platform: 'node'`, `target: 'node20'`, `sourcemap: 'inline'` (parity
  with webpack's `devtool: "inline-source-map"` — not minified, matching current
  behavior on every stage).
- After bundling: copy `views/`, `dist/`, `assets/` into `dist-lambda/` as direct
  children (mirrors `package.include` above 1:1; `build/` doesn't exist in this repo, so
  that glob is a no-op today and stays a no-op).
- Output goes to `dist-lambda/`, gitignored. The stack uses `lambda.Function` (not
  `NodejsFunction`) with `Code.fromAsset('dist-lambda')`, decoupling the Lambda build from
  CDK's own bundling — same reasoning as the reference, different specific driver (static
  assets here vs. decorator metadata there).
- `scripts/smoke-test-lambda.js` — new, not in the reference. Because this Lambda renders
  Handlebars templates from disk rather than doing a mechanical SQS→HTTP POST like
  `google-request-worker`, a template-based sanity check is worth more than trusting the
  bundler blindly. This concern was real, not speculative: the first `build-lambda.js`
  attempt failed outright — esbuild couldn't resolve `@stackla/widget-utils/handlebars`
  (a subpath export resolved via the `require` condition to `dist/cjs/handlebars/index.js`
  in the `packages/widget-utils` git submodule, which needs `npm run build:utils` before
  it's importable at all; this is a local/CI environment-setup requirement, not a bug —
  `main.yml`'s CI already checks out submodules recursively and runs `npm ci`, which
  triggers the submodule's own `prepare` build script). The script `require()`s the
  bundled `dist-lambda/src/functions/main/handler.js` in-process and invokes it with a
  Function-URL-shaped mock event, asserting a 200 JSON response from a route with no
  on-disk template dependency (`/development/stackla/cs/image/disable` — deliberately
  **not** `/preview`, see "Pre-existing finding" below). Run after `build:lambda` in CI
  and locally, catching real bundling breakage that CloudFormation-template assertions
  (`cdk/stack.spec.ts`) cannot.

## Pre-existing finding (not fixed in this PR): `/preview` et al.'s relative path likely doesn't resolve in a real deploy

Investigating the smoke test surfaced something worth flagging separately, out of scope to
fix here: `getContent()` in `src/libs/express.ts` resolves `dist/<widgetType>/*.hbs` via
`path.resolve(__dirname, "../../../../../dist/${widgetType}")` — five literal `../`
segments. Verified empirically (`sls offline` against this repo's actual, currently-shipping
`serverless-webpack` build, unmodified): this only resolves correctly because
`serverless-webpack`'s compiled output nests `handler.js` five directories below the repo
root (`server/service/src/functions/main/handler.js` — confirmed by directly inspecting a
fresh local build), and `sls offline` executes that file in place, so the five `../`
happen to land back on the **repo root's own** `dist/` (the widget-bundle build output,
`npm run build:*`'s target — not a deployment-package copy). A real deployed Lambda zip,
whatever its exact internal root turns out to be, does not preserve that specific
five-level depth relative to a same-named sibling `dist/` (this repo's own
`serverless.ts`/`config/*.json` package declares `dist/` as a **direct** top-level member
of the deployment package, i.e. 0 levels of nesting from the package root — the same
structure this migration's `build-lambda.js` produces). That mismatch strongly suggests
`/preview`, `/dev`, `/docker`, `/multi-preview`, and `/staging` already fail with `ENOENT`
in real `staging`/`production` deployments today, and only ever appear to work when
exercised through local `sls offline`. This is an application-level bug in code this
migration doesn't touch, predates this PR, and isn't something an infra migration should
silently paper over or "fix" by inventing a deployment-package layout to match undocumented
existing behavior — it's called out here and in the PR description so the owning team can
verify against real staging and decide whether/how to fix it.

## Stack contents

Mirrors `config/{staging,production}.json` 1:1 for IAM (there is no VPC config to port —
`vpc.subnetIds`/`securityGroupIds` are empty arrays on every stage in every `config/*.json`
file, so no stage here has ever actually attached a VPC).

- `lambda.Function`: `NODEJS_20_X` (kept — no runtime bump in this PR, matches
  `serverless.ts`'s `provider.runtime`), `ARM_64` (matches `provider.architecture`),
  handler `src/functions/main/handler.main`, timeout 30s (matches
  `functions.main.timeout`), `memorySize: 1024` (Serverless Framework's default when
  unset — neither `serverless.ts` nor `config/*.json` override it, and this is what's
  actually running today), explicit `LogGroup` (`provider.logRetentionInDays: 14` →
  `RetentionDays.TWO_WEEKS`, `RemovalPolicy.DESTROY`). No `tracing:` — `serverless.ts`
  never enables X-Ray, so the CDK function doesn't either (default/disabled).
- `functionName: widget-templates-${stage}-main` / role name
  `widget-templates-${stage}-${region}-lambdaRole` — matches the actual deployed
  physical names (Serverless Framework's function was literally named `main` under
  service `widget-templates`), same reasoning as the reference: keeps ARNs/log-group
  paths from silently changing where something might reference them by name.
- **Provisioned concurrency — new consideration vs. the reference.**
  `functions.main.provisionedConcurrency: 10` in `serverless.ts`, declared
  unconditionally (every stage, including `development`). AWS Lambda provisioned
  concurrency cannot target `$LATEST`; Serverless Framework transparently publishes a
  version and points the Function URL/API Gateway integration at an alias carrying the
  provisioned-concurrency config. The CDK stack must replicate this exactly, or the
  setting becomes a no-op: `fn.currentVersion` → `new lambda.Alias(this, 'LiveAlias', {
  aliasName: 'live', version, provisionedConcurrentExecutions: 10 })` →
  **`alias.addFunctionUrl(...)`, not `fn.addFunctionUrl(...)`** — the Function URL must be
  on the alias, matching where the provisioned concurrency actually lives. Preserved for
  every stage including `development`, since that's what's declared (no stage-conditional
  in the source).
- `addFunctionUrl({ authType: lambda.FunctionUrlAuthType.AWS_IAM })` (on the alias) —
  preserves the IAM-authorized Function URL.
- IAM role: `AWSLambdaBasicExecutionRole` always, plus the `iam.role.statements` from
  `config/{staging,production}.json` ported verbatim (staging: `s3:PutBucketTagging` on
  `*`; production: `lambda:GetFunction`/`EnableReplication*`/`DisableReplication*` on the
  function's own ARN and `:*` version-qualified ARN). Unlike the reference's
  `cloudfront.sourceArn` (a genuinely separate, unreferenced config key, confirmed dead by
  grep), these production statements **are** declared `iam.role.statements` entries — the
  same category of thing the reference ported 1:1 without independently re-justifying each
  one. This repo's Lambda code has no AWS SDK dependency at all (`package.json` has no
  `aws-sdk`/`@aws-sdk/*`), so none of these IAM statements are exercised by
  application code either way — but removing IAM permissions on my own judgment, without
  being able to verify nothing external (a human running `aws lambda` CLI commands against
  this function, a break-glass runbook, etc.) depends on them, is a security-relevant
  change this migration isn't the place to make. They're ported as-is; not flagged as dead
  config, unlike the reference's single non-IAM field.
- Environment: `APP_ENV: stage` — the only entry in `provider.environment` in
  `serverless.ts`.
- No VPC, no APM layers, no CloudWatch alarm, no SNS topic — none of these appear
  anywhere in this repo's `serverless.ts`/`config/*.json` (this Lambda predates/never
  adopted the Elastic APM Lambda layer pattern the reference's service uses).

## Local dev / E2E — repo-specific divergence from the reference

The reference dropped local Serverless offline emulation entirely, because its consumers
(a Jest suite) didn't depend on it. **This repo cannot do that**: `.github/workflows/e2e.yml`
(required by `main.yml`'s `e2e:` job) runs Playwright against `npm run start:test`, which
runs `sls offline start` on port 4003 — CI depends on a working local HTTP server for
`main` today.

Decision: replace `sls offline` with an Express listener — `scripts/dev-server.ts`,
`expressApp.listen(port)` using the same `getPort()` logic `serverless.ts` had
(4003 for `development`/`pipeline`/`testing`, matching `playwright.config.ts`'s
`baseURL: 'http://localhost:4003'`). `expressApp` (in `src/libs/express.ts`) is already
framework-agnostic — `serverless-http` only wraps it for real Lambda event translation,
which local dev never needed to round-trip through in the first place.

**Caught during implementation, not anticipated in the initial design:** running
`dev-server.ts` directly via plain `ts-node` breaks `/preview` and its sibling routes
outright (confirmed — it crashes the request). `getContent()` in `express.ts` resolves
`dist/<widgetType>` via 5 literal `../` from its own `__dirname`; under unbundled ts-node
execution, `__dirname` is per-source-file (`express.ts`'s own directory, `src/libs`, only
2 levels below the repo root), so 5 levels up badly overshoots. Bundling (webpack, in the
current `sls-offline` pipeline; esbuild here) collapses every module's `__dirname` down to
wherever the single compiled output file physically sits — which is what makes that
relative path resolve at all, and is *not* optional for this app. Fix: `scripts/serve-dev.js`
bundles `dev-server.ts` with esbuild to `.dev-server/service/src/functions/main/server.js`
— 5 directories below the repo root, deliberately reproducing the exact depth
`server/service/src/functions/main/handler.js` has under the current, unmodified
`serverless-webpack` build (confirmed via `sls offline` against the untouched pipeline,
before any files were deleted) — then requires and runs that bundle. `start:lambda` /
`start:lambda:test` / `start:lambda:pipeline` run `node scripts/serve-dev.js` (env vars —
`NODE_ENV`, `APP_ENV` — unchanged, since `getDomain()`/`determineEnvironment()` in
`express.ts` already read `process.env.APP_ENV` directly, not anything
Serverless-offline-specific). Verified end-to-end: both `/development/stackla/cs/image/disable`
and `/preview?widgetType=carousel` return 200 with correct content from the bundled dev
server, matching `sls offline`'s current behavior exactly.

**A second gap, also only caught by actually running the e2e suite (not just curling
routes by hand):** even after bundling correctly, the full 54-test Playwright suite failed
outright against `serve-dev.js` — the first `/preview` page load succeeded, but the very
next request (`POST /development/widgets/:wid/draft`, which the widget's own client-side
JS calls to fetch tile data) crashed the whole server, taking every subsequent test down
with `ERR_CONNECTION_REFUSED`. Root cause, confirmed by inspecting
`node_modules/serverless-http/lib/request.js`: `serverless-http`'s `ServerlessRequest`
assigns the raw Lambda-event body string directly onto `req.body` (`Object.assign(this, {
body, ... })` — no JSON parsing). `express.ts`'s own route handler calls
`JSON.parse(req.body)` itself, assuming that string is already there — a
`serverless-http`-specific idiom, not standard Express (which never populates `req.body`
without body-parser middleware, which `express.ts` doesn't register). A bare
`expressApp.listen()` therefore gets `req.body === undefined`, `JSON.parse(undefined)`
throws, and — since the throw happens inside an async handler with no `try`/`catch` — Node
kills the process on the resulting unhandled rejection (real Lambda invocations, and
`serverless-http` locally via `sls offline`, are isolated per request, so this was never
fatal before). Fixed in `scripts/dev-server.ts` by wrapping `expressApp` in a plain
`http.Server` that buffers the raw request body and assigns it to `req.body` before
delegating — exactly mirroring `ServerlessRequest` — plus a `process.on('unhandledRejection', ...)`
handler as defense in depth. Both fixes are transport-level, in the new dev-server
entrypoint only; `src/libs/express.ts` is untouched. Verified: the full e2e suite (54
tests across all 6 widget types) now passes against this server, matching `master`'s
`sls-offline` baseline exactly (confirmed via a side-by-side `git worktree` comparison).

**A third gap, found only after opening the PR and watching real CI (not local runs) fail:**
all 3 e2e shards failed in CI with `Error: Timed out waiting 120000ms from
config.webServer`, despite the full suite passing locally every time it was run by hand.
Root cause, confirmed via a side-by-side `git worktree` simulation of the exact CI steps
(`npm ci`, no manual pre-build) with `CI=true` (forcing a fresh `webServer` start instead
of reusing a leftover local process, matching real CI): a genuine race between
`start:test`'s two concurrent processes — `watch:test` (`esbuild.js --watch`, builds
`dist/`) and the HTTP server. `sls offline`'s slow webpack-based startup always gave the
watcher a head start long enough to finish its first `dist/` build before anything served
traffic; `scripts/serve-dev.js` starts in ~300ms, so a request can land before `dist/`
exists. `getContent()` then throws on the missing file — and since Express never sends a
response for that unhandled rejection (the `unhandledRejection` guard from the second gap
above stops the *process* from crashing, but doesn't answer the *request*), the connection
just hangs instead of erroring quickly, and Playwright's `webServer` readiness poll blocks
for the full 120s. Fixed by running a one-shot `build:testing`/`build:development` before
starting the concurrent watch+server pair in `start:test`/`start` (`package.json`), so
`dist/` is guaranteed to exist before the server accepts any traffic — eliminating the race
outright rather than trying to win it. Verified: the full 54-test suite passes with
`CI=true` both in a clean worktree simulation and the main working tree.

This local-dev bundle's placement is **deliberately different** from
`scripts/build-lambda.js`'s CDK deployment-package placement (`dist-lambda/src/functions/main/handler.js`,
3 levels, `dist/`/`views`/`assets` as direct package-root siblings — the structure declared
by `serverless.ts`'s own `package.include`). Local dev must keep working exactly as it does
today regardless of what's actually true of the deployed package's internal layout — see
"Pre-existing finding" below for why those two structures aren't the same, and why that's
an intentional, documented divergence rather than an inconsistency.

## Cutover (full replace, single PR)

- Delete `serverless.ts`, `config/development.json`, `config/staging.json`,
  `config/production.json`, `src/functions/main/index.ts` (only consumer was
  `serverless.ts`), `webpack.config.js` (only consumer was `serverless-webpack`).
  **Keep** `config/*.yml` — present but currently empty/unused by this repo's own code
  (no `@stackla/core-module` dependency here, unlike the reference); left alone since
  nothing in this migration touches them either way.
- Remove dependencies: `serverless`, `serverless-api-gateway-caching`, `serverless-offline`,
  `serverless-scriptable-plugin`, `serverless-webpack`, `serverless-hooks-plugin`,
  `serverless-http`, `copy-webpack-plugin`, `swc-loader` (webpack-only; esbuild/vitest
  already cover the rest of the build).
- Add dependencies: `aws-cdk`, `aws-cdk-lib`, `constructs`.
- `package.json` scripts:
  - `build:cdk` → `cdk synth` (kept distinct from the existing widget-bundle `build`
    script, which stays `APP_ENV=production node ./esbuild.js` — that's unrelated to
    infra and still needed for the S3-release step).
  - `build:lambda` → `node scripts/build-lambda.js`.
  - `smoke-test:lambda` → `node scripts/smoke-test-lambda.js`.
  - `deploy:development` / `deploy:staging` / `deploy:production` → `npm run build:lambda
    && npm run smoke-test:lambda && cdk deploy --context stage=<x> --context
    region=$AWS_REGION --require-approval never`.
  - `typecheck:cdk` → `tsc -p cdk/tsconfig.json --noEmit`; `typecheck` becomes `npx tsc &&
    npm run typecheck:cdk`.
  - `start:lambda`/`start:lambda:test`/`start:lambda:pipeline` repointed at
    `scripts/dev-server.ts` (via `ts-node`) instead of `sls offline start`.
- `.github/workflows/serverless/` composite action renamed to
  `.github/workflows/cdk-deploy/` (it deploys via CDK now — the old name would be actively
  misleading) — `action.yml`'s "Deploy serverless" step becomes "Build and deploy Lambda"
  (`npm run build:lambda && npm run smoke-test:lambda && cdk deploy ...`); the "Release to
  S3" and "Sentry Release" steps are untouched (independent of the Lambda deploy
  mechanism). `.github/workflows/release.yml`'s `uses: ./.github/workflows/serverless`
  updated to the new path.

## Verification plan

- `cdk synth --context stage=development`, `--context stage=staging --context
  region=us-east-1`, `--context stage=production --context region=us-east-1` all succeed.
- `npx vitest run cdk/stack.spec.ts` passes — IAM statements, provisioned-concurrency
  alias + Function URL placement, function name/role name, env vars, per-stage config.
- `npm run build:lambda && npm run smoke-test:lambda` succeeds — bundle produced, `/preview`
  smoke-invoked successfully in-process.
- `npm run lint` / `npm run typecheck` / `npm test` (existing vitest suite, unaffected)
  all pass unchanged.
- This repo's actual CI (`.github/workflows/main.yml`): `npm ci`, `npm run build`, `npm run
  lint`, `npm run typecheck`, `npm test` all pass locally before opening the PR.

## Addendum (2026-09-30): retroactive blue/green cutover policy

The org has since adopted a Lambda cutover policy that applies retroactively to this
epic's PRs: a Lambda with a Function URl and no other event-source trigger (this repo's
`main` — see "Critical trigger finding" above) must cut over via **blue/green** (deploy a
second CloudFormation stack, verify it, repoint callers, then delete the old stack), not
the full-replace (delete-then-recreate-under-the-same-name) approach this design doc
originally scoped in "Cutover (full replace, single PR)" above.

This does not change any of the "Stack contents" analysis above — the Lambda's config,
IAM statements, provisioned-concurrency alias, and Function URL wiring are all unchanged.
What changes:

- `cdk/stack.ts`/`cdk/app.ts` gain an optional `nameSuffix` stack prop / `--context
  nameSuffix=<suffix>` CDK context value (default `''`), which is appended to every
  physical name this stack owns — `functionName`, the IAM role's `roleName`, and (via
  `functionName`) the log group name — so a transitional stack (e.g. `nameSuffix:
  '-cutover'`) can be deployed alongside the still-live original without a physical-name
  collision. The stack id itself (`widget-templates-${stage}${nameSuffix}`) is likewise
  suffixed. Normal deploys don't set it and get the canonical names, unchanged from the
  original design.
- `PRODUCTION_FUNCTION_ARN` (the literal, ported-as-is self-referencing ARN backing
  production's `lambda:GetFunction`/`EnableReplication*`/`DisableReplication*`
  statements) is **deliberately not** suffixed — it stays pointed at the canonical,
  non-suffixed `widget-templates-production-main` regardless of `nameSuffix`, matching how
  the `content-api` reference migration treats externally-referenced ARNs (its SQS queue
  ARNs) under the same policy. See `cdk/stack.ts`'s comment on that constant.
- `docs/production-cutover-runbook.md` was rewritten so the blue/green sequence (deploy
  transitional stack → verify via `smoke-test:lambda` plus a signed request to the live
  transitional Function URL → repoint whoever calls the URL → soak → delete the old stack)
  is the primary documented flow, replacing the original mitigation-checklist framing (low-
  traffic window + manual URL propagation as standalone bullet points, no actual parallel
  deploy mechanism). The underlying trigger analysis — Function URL only, no CloudFront
  association, internal template-authoring audience, no queue to buffer a gap — is
  unchanged and is what justifies blue/green under the policy in the first place; only the
  mechanism for avoiding the gap changed, from "be careful during the gap" to "there is no
  gap because both stacks briefly coexist."
- New `cdk/stack.spec.ts` coverage (see "with nameSuffix set (transitional blue/green
  stack)"): suffixed function/role/log-group names, unsuffixed defaults, alias/Function-URL
  wiring still correct under a suffix, and the `PRODUCTION_FUNCTION_ARN` non-suffixing
  behavior above, asserted explicitly rather than left as an implicit consequence of the
  constant being module-level.
