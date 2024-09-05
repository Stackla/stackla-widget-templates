function startWebSocketServer() {
  const { spawn } = require("child_process")
  const server = spawn("node", ["hot-reload-server.js"], {
    stdio: "inherit",
    shell: true
  })
  server.on("error", err => {
    console.error("Error starting WebSocket server:", err)
  })
  return server
}

;(async () => {
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
  const isDevelopment = env === "development"

  if (isWatch && isDevelopment) {
    const server = http.createServer()
    new WebSocket.Server({ server })
  }

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
            importers: [new sass.NodePackageImporter()] // refer https://sass-lang.com/documentation/js-api/classes/nodepackageimporter/
          })

          const combined = `${result.css.toString()}\n${additionalData}`
          fs.writeFileSync(`dist/widgets/${item.parent.name}/widget.css`, combined)
        })
      })
    }
  }

  /** @type {esbuild.BuildOptions} */
  const config = {
    entryPoints: [...globSync("./widgets/**/widget.ts")],
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
    minify: true,
    plugins: [
      preAndPostBuild,
      sassPlugin({
        type: "css-text",
        minify: true,
        importMapper: path => {
          path.replace(/^@styles\//, path.join(__dirname, "widgets/styles/"))
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
      esbuild.build(config)
    } else {
      esbuild.build(config)
    }
  } else {
    esbuild.build(config)
  }
})()
