# CDK Migration Implementation Plan

**Goal:** Replace `stackla-widget-templates`'s Serverless Framework deployment of the
`main` Lambda with an AWS CDK stack, preserving IAM/env/provisioned-concurrency/Function-URL
behavior exactly, per [UGCPH-563](https://nostosolutions.atlassian.net/browse/UGCPH-563).

**Full design context:** [docs/superpowers/specs/2026-09-24-cdk-migration-design.md](../specs/2026-09-24-cdk-migration-design.md)

**Trigger finding (drives `docs/production-cutover-runbook.md`):** `main` is a synchronous,
IAM-authorized Lambda Function URL (not SQS), but confirmed (via
`stackla-infra-terraform/remote/global/content-distribution/cdn-templates.stackla.com.tf`)
to be outside the customer-facing widget-delivery path (that's CloudFront → S3, populated
by an independent CI step). It serves internal template-preview/authoring tooling only.

---

### Task 1: CDK tooling dependencies, `cdk.json`, `cdk/tsconfig.json`

**Files:** Modify `package.json`; Create `cdk.json`, `cdk/tsconfig.json`

- [ ] Add `devDependencies`: `aws-cdk`, `aws-cdk-lib`, `constructs` (pin to latest majors:
      `aws-cdk-lib ^2.270.0`, `aws-cdk ^2.1030.0`, `constructs ^10.4.2` — check
      `npm view <pkg> version` for current latest at implementation time).
- [ ] Run `npm install`; expect lockfile update only, no errors.
- [ ] Create `cdk.json`:
  ```json
  {
    "app": "npx ts-node --project cdk/tsconfig.json --prefer-ts-exts cdk/app.ts",
    "context": { "@aws-cdk/core:newStyleStackSynthesis": true }
  }
  ```
- [ ] Create `cdk/tsconfig.json` (Node/CommonJS — deliberately separate from the root
      browser-widget tsconfig, which has no `lib` beyond `DOM` and doesn't `include`
      `cdk/**`):
  ```json
  {
    "compilerOptions": {
      "target": "ES2022",
      "module": "commonjs",
      "lib": ["ES2022"],
      "moduleResolution": "node",
      "esModuleInterop": true,
      "strict": true,
      "skipLibCheck": true,
      "resolveJsonModule": true,
      "noEmit": true,
      "types": ["node"]
    },
    "include": ["**/*.ts"]
  }
  ```
- [ ] Commit: `chore: UGCPH-563: add CDK tooling dependencies`

---

### Task 2: Write failing CDK stack tests

**Files:** Create `cdk/stack.spec.ts`

Vitest, not Jest (this repo uses vitest — confirm by checking `package.json`'s `test`
script before writing). Imports `WidgetTemplatesStack` from `./stack`, which doesn't exist
yet.

- [ ] Write `cdk/stack.spec.ts` covering, per stage (`development`, `staging`, `production`):
  - Throws for an unrecognized stage.
  - `functionName`/role `roleName` match `widget-templates-${stage}-main` /
    `widget-templates-${stage}-${region}-lambdaRole`.
  - `Runtime: nodejs20.x`, `Architectures: [arm64]`, `Handler:
    src/functions/main/handler.main`, `Timeout: 30`, `MemorySize: 1024`.
  - `Environment.Variables.APP_ENV` equals the stage.
  - No `VpcConfig` on the function (no stage ever sets one).
  - `AWS::Lambda::Version` + `AWS::Lambda::Alias` (`Name: live`) exist, with
    `ProvisionedConcurrencyConfig.ProvisionedConcurrentExecutions: 10` on the alias — for
    **every** stage including `development` (unconditional in `serverless.ts`).
  - `AWS::Lambda::Url` has `AuthType: AWS_IAM` and its `TargetFunctionArn`/`Ref` binds to
    the **alias**, not the bare function (this is the detail most likely to be gotten
    wrong — assert it explicitly, e.g. via `Match.objectLike` on the `Url` resource's
    `FunctionName` referencing the alias logical ID, not the function's).
  - `development`: no extra IAM policy statements beyond the basic execution role.
  - `staging`: an `AWS::IAM::Policy` statement with `Action: 's3:PutBucketTagging'`,
    `Resource: '*'`.
  - `production`: `AWS::IAM::Policy` statements for `lambda:GetFunction`,
    `lambda:EnableReplication*` (both the bare and `:*`-suffixed ARN), and
    `lambda:DisableReplication*` (same), all scoped to
    `arn:aws:lambda:us-east-1:953585160895:function:widget-templates-production-main[:*]`.
  - `LogGroup`: `/aws/lambda/widget-templates-${stage}-main`, `RetentionInDays: 14`.
- [ ] `beforeAll`/`afterAll`: create/remove a stub `dist-lambda/src/functions/main/handler.js`
      (`exports.main = async () => {}`) so `Code.fromAsset` has something to read during
      synth, same pattern as the reference.
- [ ] Run `npx vitest run cdk/stack.spec.ts` — expect FAIL (`Cannot find module './stack'`).
      (Also add `cdk/**/*.spec.ts` to `vitest.config.ts`'s `test.include` first, or this
      won't even be picked up.)
- [ ] Commit: `test: UGCPH-563: add failing CDK stack assertions`

---

### Task 3: Implement `cdk/stack.ts` and `cdk/app.ts`

**Files:** Create `cdk/stack.ts`, `cdk/app.ts`

- [ ] `cdk/stack.ts` — `WidgetTemplatesStack`, per the design doc's "Stack contents"
      section: `STAGE_CONFIGS` map (`development`/`staging`/`production` → IAM statement
      list), `LogGroup`, `Role` (+ ported IAM statements), `lambda.Function` (`code:
      lambda.Code.fromAsset(path.join(__dirname, '../dist-lambda'))`, `handler:
      'src/functions/main/handler.main'`), `fn.currentVersion` → `lambda.Alias` (`aliasName:
      'live'`, `provisionedConcurrentExecutions: 10`) → `alias.addFunctionUrl({ authType:
      lambda.FunctionUrlAuthType.AWS_IAM })`.
- [ ] `cdk/app.ts` — resolve `stage` from context (default `development`), `region` from
      `--context region=<x>` / `process.env.AWS_REGION` / `process.env.CDK_DEFAULT_REGION`
      / `us-east-1`; `CliCredentialsStackSynthesizer` (`fileAssetsBucketName:
      stackla-serverless-${stage}-deploys`, `bucketPrefix: 'cdk-assets/'`); stack id
      `widget-templates-${stage}`; tag `cdk=true`.
- [ ] `npx vitest run cdk/stack.spec.ts` — PASS.
- [ ] Commit: `feat: UGCPH-563: add CDK stack for widget-templates`

---

### Task 4: Lambda bundling + smoke-test scripts

**Files:** Create `scripts/build-lambda.js`, `scripts/smoke-test-lambda.js`

- [ ] `scripts/build-lambda.js` — esbuild Node API: `entryPoints:
      ['src/functions/main/handler.ts']`, `outfile:
      'dist-lambda/src/functions/main/handler.js'` (not `outdir` — must preserve the exact
      relative nesting `getContent()` in `express.ts` depends on), `bundle: true, platform:
      'node', target: 'node20', sourcemap: 'inline'` (no `minify` — parity with webpack's
      `devtool: 'inline-source-map'`). After bundling: `fs.cpSync` `views/`, `dist/`,
      `assets/` into `dist-lambda/` as direct children (mirror `serverless.ts`'s
      `package.include`).
- [ ] Run `node scripts/build-lambda.js`; expect `dist-lambda/src/functions/main/handler.js`,
      `dist-lambda/views/*.hbs`, `dist-lambda/dist/...`, `dist-lambda/assets/...` all present.
- [ ] `scripts/smoke-test-lambda.js` — `require('../dist-lambda/src/functions/main/handler.js').main`,
      invoke with a minimal Function-URL-shaped event (`{ version: '2.0', rawPath:
      '/preview', rawQueryString: 'widgetType=carousel', requestContext: { http: { method:
      'GET', path: '/preview' } }, headers: {} }`), assert `statusCode === 200` and the
      body contains an expected marker (e.g. `<html`). Exit non-zero on failure or
      exception.
- [ ] Run `node scripts/smoke-test-lambda.js`; expect exit 0. If bundling `hbs` breaks
      (dynamic `require` issue), fix by marking `hbs` external in `build-lambda.js` and
      copying `node_modules/hbs` (+ resolved deps) into `dist-lambda/node_modules/hbs`
      instead — only do this if the smoke test actually demonstrates the problem, don't
      pre-emptively guess.
- [ ] Re-run `npx vitest run cdk/stack.spec.ts` against the real bundle — still PASS (stack
      test only reads CFN properties, not bundle contents).
- [ ] Commit: `feat: UGCPH-563: add esbuild bundling and smoke test for the CDK Lambda`

---

### Task 5: Replace `sls offline` for local dev/E2E

**Files:** Create `scripts/dev-server.ts`; Modify `package.json`

- [ ] `scripts/dev-server.ts`: import `expressApp` from `../src/libs/express`, `const port
      = [4003 for development/pipeline/testing else 80]` (port `getPort()` logic ported
      from the old `serverless.ts`), `expressApp.listen(port, () => console.info(...))`.
- [ ] `package.json`: `start:lambda` → `NODE_ENV=development ts-node scripts/dev-server.ts`;
      `start:lambda:test` → `NODE_ENV=development APP_ENV=testing ts-node
      scripts/dev-server.ts`; `start:lambda:pipeline` → `NODE_ENV=development
      APP_ENV=pipeline ts-node scripts/dev-server.ts`.
- [ ] Run `npm run start:test` (in one shell) and `curl
      http://localhost:4003/preview?widgetType=carousel` (in another) — expect HTML back,
      same as before. Kill the server.
- [ ] Commit: `feat: UGCPH-563: replace sls offline with a plain Express dev server`

---

### Task 6: `package.json` script/dependency cleanup, `.gitignore`, `typecheck:cdk`

**Files:** Modify `package.json`, `.gitignore`, `vitest.config.ts`

- [ ] Add `cdk/**/*.spec.ts` to `vitest.config.ts`'s `test.include`.
- [ ] `package.json` scripts: add `build:cdk` (`cdk synth`), `build:lambda` (already
      added Task 4), `smoke-test:lambda` (already added Task 4), `deploy:development` /
      `deploy:staging` / `deploy:production` (`npm run build:lambda && npm run
      smoke-test:lambda && cdk deploy --context stage=<x> --context region=$AWS_REGION
      --require-approval never`), `typecheck:cdk` (`tsc -p cdk/tsconfig.json --noEmit`);
      change `typecheck` to `npx tsc && npm run typecheck:cdk`. Remove
      `start:lambda:pipeline`'s and friends' old `sls offline` invocations (superseded by
      Task 5).
- [ ] Remove `devDependencies`: `serverless`, `serverless-api-gateway-caching`,
      `serverless-offline`, `serverless-scriptable-plugin`, `serverless-webpack`,
      `copy-webpack-plugin`, `swc-loader`. Remove `dependencies`: `serverless-hooks-plugin`,
      `serverless-http`.
- [ ] `npm install` — settle the lockfile.
- [ ] `.gitignore`: replace `.serverless`/`server` lines with `/cdk.out` and
      `/dist-lambda`.
- [ ] Run `npm run typecheck` — PASS (both `npx tsc` and the new `typecheck:cdk`).
- [ ] Commit: `chore: UGCPH-563: switch npm scripts and deps from Serverless to CDK`

---

### Task 7: Remove the legacy Serverless Framework setup

**Files:** Delete `serverless.ts`, `webpack.config.js`, `src/functions/main/index.ts`,
`config/development.json`, `config/staging.json`, `config/production.json`

- [ ] Confirm nothing else references them:
      `grep -rn "serverless.ts\|webpack.config\|functions/main/index" --include="*.ts"
      --include="*.js" --include="*.json" . | grep -v node_modules | grep -v dist-lambda`
      — expect only self-references / the files themselves.
- [ ] `git rm serverless.ts webpack.config.js src/functions/main/index.ts
      config/development.json config/staging.json config/production.json`
- [ ] `npm test` — PASS (existing vitest suite doesn't depend on any of these).
- [ ] Commit: `chore: UGCPH-563: remove Serverless Framework configuration`

---

### Task 8: Update GitHub Actions

**Files:** Rename `.github/workflows/serverless/` → `.github/workflows/cdk-deploy/`;
Modify `.github/workflows/cdk-deploy/action.yml`, `.github/workflows/release.yml`

- [ ] `git mv .github/workflows/serverless .github/workflows/cdk-deploy`
- [ ] In `action.yml`, replace the "Deploy serverless" step:
  ```yaml
  - name: Build and deploy Lambda
    shell: bash
    env:
      APP_ENV: ${{ inputs.stage }}
      AWS_REGION: ${{ inputs.aws-region }}
    run: |
      cd ${{ inputs.working-directory }}
      npm run build:lambda
      npm run smoke-test:lambda
      npx cdk deploy --context stage=${{ inputs.stage }} --context region=${{ inputs.aws-region }} --require-approval never
  ```
  Leave the "Install NPM", "Configure AWS credentials", "Do Build", "Release to S3", and
  "Sentry Release" steps untouched.
- [ ] `.github/workflows/release.yml`: `uses: ./.github/workflows/serverless` →
      `uses: ./.github/workflows/cdk-deploy`.
- [ ] Commit: `ci: UGCPH-563: deploy via CDK instead of Serverless Framework`

---

### Task 9: `docs/production-cutover-runbook.md`

- [ ] Write the runbook per the design doc's "Cutover risk" analysis: what the trigger is,
      why it's not customer-facing, what the actual gap risk is (Function URL identity
      changes on a delete+recreate cutover — no automatic retry the way SQS has), and the
      concrete mitigations (low-traffic window + advance notice to widget-ui/template
      authors; validate the new Function URL immediately post-deploy before treating
      cutover as complete; capture and update the new Function URL wherever it's
      referenced; keep the old Serverless deploy artifacts available for a fast rollback
      via `sls deploy` if the CDK stack fails to come up; longer-term follow-up
      recommendation — front the Function URL with a stable custom domain so future
      cutovers are transparent, out of scope for this PR).
- [ ] Commit: `docs: UGCPH-563: add production cutover runbook`

---

### Task 10: End-to-end verification

- [ ] `npx cdk synth --context stage=development --quiet`,
      `--context stage=staging --context region=us-east-1 --quiet`,
      `--context stage=production --context region=us-east-1 --quiet` — all succeed.
- [ ] `npm test` — PASS.
- [ ] `npm run lint` — PASS (fix any findings in `cdk/*.ts`).
- [ ] `npm run typecheck` — PASS.
- [ ] `npm run build` — PASS (widget esbuild build, unaffected but must still work).
- [ ] Re-confirm `npm run build:lambda && npm run smoke-test:lambda` still passes after all
      deletions in Task 7.
- [ ] Do **not** run `cdk deploy`/`cdk bootstrap` or anything touching live AWS.

---

### Task 11: Open the pull request

- [ ] Push branch, open PR via `.github/pull_request_template.md` (fill completely).
      Title: `feat: UGCPH-563: migrate widget-templates Lambda deployment from Serverless to CDK`.
      Call out: full replace in a single PR; the Function-URL trigger/cutover-risk finding
      and mitigation; provisioned concurrency now lives on a `live` alias (required for the
      setting to have any effect, not new behavior); IAM statements ported verbatim without
      independently re-justifying each one; local dev/E2E now uses a plain Express server
      instead of `sls offline`.
- [ ] Comment on UGCPH-563 with the PR link, summary, and the trigger/cutover-risk finding.

---

### Addendum (2026-09-30): retroactive blue/green cutover policy

**Full context:** [docs/superpowers/specs/2026-09-24-cdk-migration-design.md](../specs/2026-09-24-cdk-migration-design.md#addendum-2026-09-30-retroactive-blue-green-cutover-policy)

The org adopted a Lambda cutover policy, applied retroactively to this epic's PRs: `main`
(Function URL, no other event-source trigger) must cut over via blue/green, not the
full-replace this plan originally scoped. Added to this same PR/branch
(`feat/UGCPH-563-cdk-migration`) rather than a follow-up ticket, per instruction.

- [x] `cdk/stack.ts`: add optional `nameSuffix?: string` to `WidgetTemplatesStackProps`
      (default `''`), append it to `functionName` and the IAM role's `roleName` (the log
      group name is derived from `functionName`, so it's suffixed automatically). Leave
      `PRODUCTION_FUNCTION_ARN` unsuffixed — it's a literal, ported-as-is self-referencing
      ARN, not derived from `stage`/`nameSuffix`.
- [x] `cdk/app.ts`: read `nameSuffix` from `--context nameSuffix=<suffix>` (default `''`),
      append to the stack id (`widget-templates-${stage}${nameSuffix}`), pass through to
      `WidgetTemplatesStackProps`.
- [x] `cdk/stack.spec.ts`: add a `describe("with nameSuffix set (transitional blue/green
      stack)")` block — suffixed function/role/log-group names, unsuffixed default,
      alias/Function-URL wiring (`live` alias, provisioned concurrency 10, `Qualifier:
      "live"`) still correct under a suffix, staging's `s3:PutBucketTagging` statement
      still present under a suffix, and production's `PRODUCTION_FUNCTION_ARN` statements
      staying pointed at the canonical non-suffixed ARN under a suffix.
- [x] `npx vitest run cdk/stack.spec.ts` — PASS (24 tests: the original 14 plus 10 new).
- [x] Rewrite `docs/production-cutover-runbook.md`: blue/green sequence (deploy
      transitional stack → verify via `smoke-test:lambda` + a signed request to the live
      transitional Function URL → repoint whoever calls the URL, since there's no
      CloudFront/config file to swap for this internal-tooling Lambda → soak → delete the
      old stack) as the primary flow, replacing the original mitigation-checklist framing.
      Kept the underlying trigger/blast-radius analysis (Function URL only, no CloudFront
      association, internal audience) — that finding is what justifies blue/green under the
      policy, only the mechanism changed.
- [x] `docs/superpowers/specs/2026-09-24-cdk-migration-design.md`: add the addendum this
      plan addendum links to.
- [x] `README.md`: "Deployment" section still described `sls deploy`/`serverless.ts`
      (stale even before this policy update — the original migration never updated it).
      Rewrote to describe `npm run deploy:<stage>` / `cdk deploy` / `cdk diff`, and added a
      "Blue/green cutover of the `main` Lambda" subsection pointing at the runbook. Also
      fixed two smaller stale references (`Framework: AWS Serverless Framework` → `AWS
      CDK`; project-structure tree's `serverless.ts` line → `cdk/`) and the Serverless
      Framework docs link → AWS CDK docs link.
- [ ] Re-verify: `npm run build && npm run lint && npm run typecheck && npm test` (35
      tests), all 3 Playwright e2e shards, GitGuardian, `cdk synth` for all 3 stages × both
      normal and suffixed (`nameSuffix=-cutover`) configs, `npm run build:lambda && npm run
      smoke-test:lambda`. Push and confirm GitHub Actions CI is green again.
- [ ] Commit (`feat: UGCPH-563: <description>`, ending with the required
      `Co-Authored-By` trailer) and push to `feat/UGCPH-563-cdk-migration`.
- [ ] Comment on UGCPH-563 noting the blue/green addendum (best-effort — this ticket's
      main comment already posted; don't block on a 403).
