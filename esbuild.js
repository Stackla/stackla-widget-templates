const { pathToFileURL } = require("node:url")

function startWebSocketServer() {
  const { spawn } = require("node:child_process")
  const server = spawn("node", ["hot-reload-server.js"], {
    stdio: "inherit",
    shell: true
  })
  server.on("error", err => {
    console.error("Error starting WebSocket server:", err)
  })
  return server
}

async function buildAll() {
  const esbuild = require("esbuild")
  const { sassPlugin } = require("esbuild-sass-plugin")
  const { copy } = require("esbuild-plugin-copy")
  const path = require("path")
  const sass = require("sass")
  const { globSync } = require("glob")
  const fs = require("fs")
  const env = process.env.APP_ENV || "development"
  const http = require("http")
  const WebSocket = require("ws")

  const isWatch = process.argv.includes("--watch")
  const isDevelopment = env === "development" || env === 'staging'

  const preAndPostBuild = {
    name: "preAndPost",
    setup(build) {
      // Cleanup dist before build
      build.onStart(() => {
        fs.rmSync("./dist", { recursive: true, force: true })
      })

      build.onEnd(() => {
        // Include additional libraries in the final CSS
        // These libraries are located in the `styles` folder
        const additionalData = globSync("./widgets/styles/*.scss", { withFileTypes: true })
          .map(path =>
            sass.compile(path.relative(), {
              style: env === "development" ? "expanded" : "compressed"
            })
          )
          .map(scss => scss.css.toString())
          .join("\n")

        globSync("./widgets/**/widget.scss", { withFileTypes: true }).forEach(item => {
          const result = sass.compile(item.relative(), {
            style: env === "development" ? "expanded" : "compressed",
            loadPaths: [path.join(__dirname, "./widgets/libs")],
            importers: [
              new sass.NodePackageImporter(),
              {
                findFileUrl(url) {
                  if (url.startsWith("@templates")) {
                    const newUrl = pathToFileURL(url.replace("@", "widgets/libs/"))
                    return new URL(newUrl)
                  }

                  if (url.startsWith("@styles")) {
                    const newUrl = pathToFileURL(url.replace("@", "widgets/"))
                    return new URL(newUrl)
                  }

                  return null
                }
              }
            ] // refer https://sass-lang.com/documentation/js-api/classes/nodepackageimporter/
          })

          const combined = `${result.css.toString()}\n${additionalData}`
          fs.writeFileSync(`dist/widgets/${item.parent.name}/widget.css`, combined)
        })
      })
    }
  }

  const getWebSocketJS = () => {
    return isDevelopment
        ? `(() => {
      const ws = new WebSocket("ws://localhost:3001");
      ws.onmessage = () => {
        location.reload();
      };
    })();`
        : ``
}



  /** @type {esbuild.BuildOptions} */
  const config = {
    entryPoints: [...globSync("./widgets/**/widget.ts")], // Entry points for all widgets
    bundle: true,
    outdir: "dist/widgets",
    loader: {
      ".hbs": "text",
      ".css": "text"
    },
    banner: {
      js: `
      // get selector attribute from url
      function getSelectorAttribute(url) {
        const urlParams = new URLSearchParams(url.search);
        return urlParams.get("selector");
      }

      // Get the current js file loaded 
      const jsFile = import.meta.url;
      const sdk = window.ugc.getWidgetBySelector(getSelectorAttribute(jsFile));
      ${getWebSocketJS()}
      `
    },
    minify: true,
    splitting: true,
    format: 'esm',
    chunkNames: '[name]-[hash]',
    plugins: [
      preAndPostBuild,
      sassPlugin({
        type: "css-text",
        minify: true,
        importMapper: url => {
          return url.replace(/^@styles\//, path.join(__dirname, "widgets/styles/"))
        },
        importers: [new sass.NodePackageImporter()]
      }),
      copy({
        resolveFrom: "cwd",
        assets: [
          {
            from: ["./widgets/**/*.hbs"],
            to: ["./dist/widgets"]
          }
        ]
      })
    ]
  }

  if (env == "development") {
    config.minify = false
    config.sourcemap = "inline"

    if (isWatch) {
      startWebSocketServer()
    }
  }

  await esbuild.build(config)
}

async function buildAllWithErrorHandling(retries = 0) {
  if (retries > 3) {
    console.error("Failed to build after 3 retries. Exiting.")
    process.exit(1)
  }

  try {
    await buildAll()
  } catch (e) {
    console.error("Error building. Retrying.", e)
    await new Promise(resolve => setTimeout(resolve, 3000))
    buildAllWithErrorHandling(retries + 1)
  }
}

buildAllWithErrorHandling()
