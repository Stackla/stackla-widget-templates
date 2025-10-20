import { build } from "esbuild"

build({
  entryPoints: ["widget-loader-v3.ts", "widget-loader-v2.ts"],
  bundle: true,
  minify: true,
  treeShaking: true,
  outdir: "dist"
})
