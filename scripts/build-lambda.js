#!/usr/bin/env node
const esbuild = require("esbuild")
const fs = require("fs")
const path = require("path")

const outdir = path.resolve(__dirname, "../dist-lambda")
const repoRoot = path.resolve(__dirname, "..")

async function main() {
  fs.rmSync(outdir, { recursive: true, force: true })
  fs.mkdirSync(outdir, { recursive: true })

  // outfile (not outdir) deliberately preserves the exact same relative nesting
  // (src/functions/main/handler.js) that the deployed Serverless Framework package has
  // today — src/libs/express.ts's getContent() resolves dist/<widgetType> relative to
  // __dirname, so the depth of handler.js from the deployment root must stay unchanged.
  await esbuild.build({
    entryPoints: [path.join(repoRoot, "src/functions/main/handler.ts")],
    outfile: path.join(outdir, "src/functions/main/handler.js"),
    bundle: true,
    platform: "node",
    target: "node20",
    // No minify, inline sourcemap — parity with the webpack pipeline's
    // `devtool: "inline-source-map"`, used unminified on every stage today.
    sourcemap: "inline",
    logLevel: "info"
  })

  // Mirrors serverless.ts's `package.include: ["views/**/*", "dist/**/*", "build/**/*",
  // "assets/**/*"]` — these are static assets read from disk at runtime
  // (fs.readFileSync), not pulled in by the JS bundle.
  for (const dir of ["views", "dist", "assets"]) {
    const src = path.join(repoRoot, dir)
    if (fs.existsSync(src)) {
      fs.cpSync(src, path.join(outdir, dir), { recursive: true })
    }
  }

  console.info(`Lambda bundle written to ${outdir}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
