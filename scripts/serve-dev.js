#!/usr/bin/env node
// Bundles scripts/dev-server.ts with esbuild and runs the result, instead of running it
// directly via ts-node.
//
// This isn't just a style choice: src/libs/express.ts's getContent() resolves
// `dist/<widgetType>` via 5 literal `../` segments from its own __dirname. Under plain
// (unbundled) ts-node execution, __dirname is per-source-file — express.ts's own
// directory, src/libs — and 5 levels up from there badly overshoots the repo root,
// breaking /preview and its sibling routes (confirmed: this crashes the server outright).
// Bundling (webpack, in the old sls-offline setup; esbuild here) collapses every
// module's __dirname down to wherever the single compiled output file physically sits,
// which is what makes that relative path resolve at all. This mirrors the *local dev*
// depth that already works today (verified against the current, unmodified
// serverless-webpack pipeline via `sls offline`) — deliberately not the flatter layout
// scripts/build-lambda.js produces for the deployed CDK package (see
// docs/superpowers/specs/2026-09-24-cdk-migration-design.md's "Pre-existing finding" for
// why those differ, and why local dev needs to keep working regardless of what happens to
// be true of the current real deployment).
const esbuild = require("esbuild")
const path = require("path")

const repoRoot = path.resolve(__dirname, "..")
// 5 directories below repoRoot, so getContent()'s `../../../../../dist` lands back on
// repoRoot/dist — the same depth server/service/src/functions/main/handler.js has under
// the current serverless-webpack build.
const outfile = path.join(repoRoot, ".dev-server/service/src/functions/main/server.js")

async function main() {
  await esbuild.build({
    entryPoints: [path.join(repoRoot, "scripts/dev-server.ts")],
    outfile,
    bundle: true,
    platform: "node",
    target: "node20",
    sourcemap: "inline",
    logLevel: "info"
  })

  require(outfile)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
