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

  const isWatch = process.argv.includes("--watch")
  const isDevelopment = env === "development" || env === "staging"

  const preAndPostBuild = {
    name: "preAndPost",
    setup(build) {
      // Cleanup dist before build
      build.onStart(() => {
        fs.rmSync("./dist", { recursive: true, force: true })
      })

      build.onEnd(() => {
        globSync("./widgets/**/widget.scss", { withFileTypes: true }).forEach(item => {
          const result = sass.compile(item.relative(), {
            style: env === "development" ? "expanded" : "compressed",
            loadPaths: [path.join(__dirname, "./widgets/libs")],
            importers: [
              new sass.NodePackageImporter(),
              {
                findFileUrl(url) {
                  if (url.startsWith("@templates")) {
                    const newUrl = pathToFileURL(url.replace("@", "widgets/styles/"))
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

          const combined = `${result.css.toString()}`
          fs.writeFileSync(`dist/widgets/${item.parent.name}/widget.css`, combined)
        })
      })
    }
  }

  const TEST_SERVER = "http://localhost:4002/development"
  const DEV_SERVER = "http://localhost:4003/development"

  const getWidgetEndpoint = () => {
    switch (process.env.APP_ENV) {
      case "production":
        return "https://widget-data.stackla.com"
      case "staging":
        return "https://widget-data.teaser.stackla.com"
      case "testing":
        return TEST_SERVER
      case "development":
        return DEV_SERVER
      default:
        return "http://localhost:5006"
    }
  }

  const getGoConnectEndpoint = () => {
    switch (process.env.APP_ENV) {
      case "production":
        return "https://goconnect.stackla.com"
      case "staging":
        return "https://goconnect.teaser.stackla.com"
      case "testing":
        return TEST_SERVER
      case "development":
        return DEV_SERVER
      default:
        return "http://localhost:5006"
    }
  }

  /** @type {esbuild.BuildOptions} */
  const config = {
    entryPoints: [...globSync("./widgets/**/widget.tsx")],
    bundle: true,
    outdir: "dist/widgets",
    loader: {
      ".hbs": "text",
      ".css": "text"
    },
    banner: {
      js: isDevelopment
        ? `(() => {
      const ws = new WebSocket("ws://localhost:3001");
      ws.onmessage = () => {
        location.reload();
      };
    })();`
        : ``
    },
    define: {
      WIDGET_ENDPOINT: JSON.stringify(getWidgetEndpoint()),
      DIRECT_UPLOADER_ENDPOINT: JSON.stringify(getGoConnectEndpoint())
    },
    jsx: "automatic",
    minify: true,
    plugins: [
      preAndPostBuild,
      sassPlugin({
        type: "css-text",
        minify: true,
        importMapper: url => {
          return url.replace(/^@styles\//, path.join(__dirname, "widgets/styles/"))
        }
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

async function buildUtils() {
  const { exec } = require("child_process")
  const util = require("util")
  const execPromise = util.promisify(exec)

  console.log(`Building utils... for ${process.env.APP_ENV}`)

  await execPromise("npm run build:utils")
}

async function buildAllWithErrorHandling(retries = 0) {
  if (!process.env.APP_ENV) {
    console.error("APP_ENV is not set. Exiting.")
    return;
  }

  if (retries > 3) {
    console.error("Failed to build after 3 retries. Exiting.")
    return;
  }

  try {
    await buildUtils()
    await buildAll()
  } catch (e) {
    console.error("Error building. Retrying.", e)
    await new Promise(resolve => setTimeout(resolve, 3000))
    buildAllWithErrorHandling(retries + 1)
  }
}

buildAllWithErrorHandling()
