const { pathToFileURL } = require("node:url")
const postcssUrl = require("postcss-url")
const postcss = require("postcss")
const SVGSpriter = require('svg-sprite');

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

const getTemplatesEndpoint = () => {
  switch (process.env.APP_ENV) {
    case "production":
      return "https://templates.stackla.com"
    case "staging":
    case "testing":
      return "https://templates.teaser.stackla.com"
    case "development":
      return "http://localhost:4003"
    default:
      return "http://localhost:4003"
  }
}

const postcssPlugins = [
  postcssUrl({
    url: asset => {
      if (asset.url.includes("assets/")) {
        return `${getTemplatesEndpoint()}/${asset.url}`
      }
      return asset.url
    }
  })
]

const config = {
    shape: {
      transform: ['svgo'],
    },
    mode: {
        css: {
            dest: ".",
            prefix: ".icon-%s",
            dimensions: true,
            render: {
                css: true
            },
            bust: false,
            sprite: `${getTemplatesEndpoint()}/assets/spritemaps/icons.svg`
        }
    },
}

const spriter = new SVGSpriter(config);

async function transformSvgFolderToSprite() {
  const fs = require('fs')
  const path = require('path')
  const { promisify } = require('util')
  const readdir = promisify(fs.readdir)
  const readFile = promisify(fs.readFile)
  const writeFile = promisify(fs.writeFile)
  const mkdir = promisify(fs.mkdir)

  const svgFolder = 'assets/svg';
  const svgFiles = await readdir(svgFolder)

  await Promise.all(svgFiles.map(async svgFile => {
      if (!svgFile.endsWith('.svg')) {
          return
      }

      const svgPath = path.join(svgFolder, svgFile)
      const svgContent = await readFile(svgPath, 'utf-8')
      spriter.add(svgPath, svgFile, svgContent)
  }));

  const { result } = await spriter.compileAsync();

  const spriteFolder = path.join(__dirname, 'dist/assets/spritemaps')
  await mkdir(spriteFolder, { recursive: true })
    
  await writeFile(path.join(spriteFolder, 'icons.svg'), result.css.sprite.contents)
  await writeFile(path.join(spriteFolder, 'icons.css'), result.css.css.contents)
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

  await transformSvgFolderToSprite();

  const preAndPostBuild = {
    name: "preAndPost",
    setup(build) {
      // Cleanup dist before build
      build.onStart(() => {
        if (fs.existsSync("./dist")) {
          fs.readdirSync("./dist").forEach(file => {
            if (file !== "assets") {
              fs.rmSync(`./dist/${file}`, { recursive: true, force: true })
            }
          })
        }
      })

      build.onEnd(() => {
        globSync("./widgets/**/widget.scss", { withFileTypes: true }).forEach(async item => {
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

          const postCssResult = await postcss(postcssPlugins).process(combined, { from: item.relative() })
          const postCssCombined = postCssResult.css

          fs.writeFileSync(`dist/${item.parent.name}/widget.css`, postCssCombined)
        })
      })
    }
  }

  const TEST_SERVER = "http://localhost:4003/development"
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
      case "pipeline":
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
      case "pipeline":
        return DEV_SERVER
      default:
        return "http://localhost:5006"
    }
  }

  /** @type {esbuild.BuildOptions} */
  const config = {
    entryPoints: [...globSync("./widgets/**/widget.tsx")],
    bundle: true,
    outdir: "dist",
    loader: {
      ".hbs": "text",
      ".css": "text"
    },
    treeShaking: true,
    banner: {
      js: env == "development"
        ? `(() => {
      const ws = new WebSocket("ws://localhost:3001");
      ws.onmessage = () => {
        setTimeout(() => {
          location.reload();
        }, 1000);
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
        },
        importers: [new sass.NodePackageImporter()]
      }),
      copy({
        resolveFrom: "cwd",
        assets: [
          {
            from: ["./widgets/**/*.hbs"],
            to: ["./dist"]
          }
        ]
      })
    ]
  }

  if (env == "development") {
    config.minify = false
    config.sourcemap = "linked"

    if (isWatch && env == "development") {
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

  if (process.env.APP_ENV === "development") {
    await execPromise("npm run build:utils:dev")
    return
  }
  await execPromise("npm run build:utils")
}

async function buildAllWithErrorHandling(retries = 0) {
  const args = process.argv.length ? process.argv[process.argv.length - 1] : null
  if (!process.env.APP_ENV) {
    console.error("APP_ENV is not set. Exiting.")
    return
  }

  if (retries > 3) {
    console.error("Failed to build after 3 retries. Exiting.")
    return
  }

  try {
    if (args && (args.includes('widget-utils') || args.includes('--watch'))) {
      await buildUtils()
    }
    console.log(`Building... for ${process.env.APP_ENV}`)
    await buildAll()
  } catch (e) {
    console.error("Error building. Retrying.", e)
    await new Promise(resolve => setTimeout(resolve, 3000))
    buildAllWithErrorHandling(retries + 1)
  }
}

buildAllWithErrorHandling()
