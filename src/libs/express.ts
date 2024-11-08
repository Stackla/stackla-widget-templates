import express from "express"
import "hbs"
import cors from "cors"
import path from "path"
import { readFileSync } from "fs"
import * as Handlebars from "hbs"
import { getAndRenderTiles, getTilesToRender, renderTemplates } from "./tile.handlers"
import widgetOptions from "../../tests/fixtures/widget.options"
import cookieParser from "cookie-parser"
import tiles from "../../tests/fixtures/tiles"
import { createMockRoutes } from "../../tests/libs/developer"

export interface IDraftRequest {
  customTemplates: {
    layout: {
      template: string
    }
    tile: {
      template: string
    }
  }
  customCSS: string
  customJS: string,
  widgetOptions: typeof widgetOptions.widgetConfig
}

type PreviewContent = {
  layoutCode: string
  tileCode: string
  cssCode: string
  jsCode: string
}

const expressApp = express()
expressApp.use((_req, res, next) => {
  res.set("Cache-Control", "public, max-age=300")
  next()
})
expressApp.use(express.static("dist/widgets", { redirect: false }))
expressApp.engine("hbs", Handlebars.__express)
expressApp.set("view engine", "hbs")
expressApp.use(cors())
expressApp.use(cookieParser())

createMockRoutes(expressApp)

const stripSymbols = (str: string) => str.replace(/[^a-zA-Z0-9]/g, "")
const stripSymbolsThatAreNotDash = (str: string) => str.replace(/[^a-zA-Z0-9-]/g, "")

expressApp.use((req, res, next) => {
  const host = req.headers.host || "http://localhost:4003"
  const port = host.split(":")[1]
  if (req.hostname === "127.0.0.1") {
    res.redirect(301, `http://localhost:${port}${req.originalUrl}`)
    return
  }

  const dependentPaths = ["/widgets/668ca52ada8fb", "/widgets/668ca52ada8fb/rendered/tiles"]
  if (dependentPaths.includes(req.path) && !req.cookies.widgetType) {
    res.status(400).send("widgetType cookie is not available")
    return
  }

  next()
})

expressApp.use("/preview", (req, res, next) => {
  const widgetType = req.query.widgetType
  if (!widgetType) {
    res.status(400).send("widgetType query parameter is required")
  } else {
    res.cookie("widgetType", widgetType, { maxAge: 360000 })
    next()
  }
})

async function getContent(widgetType: string, retry = 0): Promise<PreviewContent> {
  if (retry > 3) {
    throw new Error(`Failed to get content, exiting after 3 retries, widgetType: ${widgetType}`)
  }

  const rootDir = path.resolve(__dirname, `../../../../../dist/widgets/${widgetType}`)

  const layout = `${rootDir}/layout.hbs`
  const tile = `${rootDir}/tile.hbs`
  const css = `${rootDir}/widget.css`
  const js = `${rootDir}/widget.js`

  try {
    return {
      layoutCode: readFileSync(layout, "utf8"),
      tileCode: readFileSync(tile, "utf8"),
      cssCode: readFileSync(css, "utf8"),
      jsCode: readFileSync(js, "utf8")
        .replace(/\\/g, "\\\\")
        .replace(/\"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
    }
  } catch (e) {
    await new Promise(resolve => setTimeout(resolve, 3000))

    return getContent(widgetType, retry + 1)
  }
}

async function getHTML(content: PreviewContent, page: number = 1, limit: number = 25) {
  return await getAndRenderTiles(
    {
      customTemplates: {
        layout: {
          template: content.layoutCode || ""
        },
        tile: {
          template: content.tileCode || ""
        }
      },
      customCSS: content.cssCode || "",
      customJS: content.jsCode || "",
      widgetOptions: widgetOptions.widgetConfig
    },
    page,
    limit
  )
}

expressApp.post("/development/widgets/668ca52ada8fb/draft", async (req, res) => {
  const body = JSON.parse(req.body)
  const draft = body.draft as IDraftRequest
  const html = await renderTemplates(draft, body.page, body.limit)
  const customCss = draft.customCSS
  const customJs = draft.customJS

  res.send({
    html,
    customCSS: customCss,
    customJS: customJs,
    widgetOptions: widgetOptions,
    stackId: 1451,
    merchantId: "shopify-64671154416",
    tileCount: tiles.length,
    enabled: 1
  })
})

expressApp.get("/development/widgets/668ca52ada8fb", async (req, res) => {
  const content = await getContent(req.cookies.widgetType as string)

  res.json({
    html: await getHTML(content),
    customCSS: content.cssCode,
    customJS: content.jsCode,
    widgetOptions: widgetOptions,
    merchantId: "shopify-64671154416",
    stackId: 1451,
    tileCount: tiles.length
  })
})

expressApp.get("/development/widgets/668ca52ada8fb/tiles", async (req, res) => {
  const page = (req.query.page ?? 0) as number
  const limit = (req.query.limit ?? 25) as number
  res.send({
    tiles: getTilesToRender(page, limit)
  })
})

expressApp.get("/development/widgets/668ca52ada8fb/tiles/:tid", async (req, res) => {
  res.json(tiles.find(tile => tile.id === req.params.tid))
})

expressApp.get("/development/widgets/668ca52ada8fb/rendered/tiles", async (req, res) => {
  const widgetType = req.cookies.widgetType as string
  const page = (req.query.page ?? 0) as number
  const limit = (req.query.limit ?? 25) as number
  const tileHtml = await getHTML(await getContent(widgetType), page, limit)

  res.json(tileHtml)
})

expressApp.get("/development/stackla/cs/image/disable", async (req, res) => {
  res.json({ success: true })
});

// Register preview route
expressApp.get("/preview", async (req, res) => {
  const port = req.headers.host?.split(":")[1] || "4003"
  const widgetRequest = req.query
  const widgetType = req.query.widgetType as string

  res.render("preview", {
    widgetRequest: JSON.stringify(widgetRequest),
    widgetType,
    widgetOptions: JSON.stringify(widgetOptions.widgetConfig),
    environment: process.env.APP_ENV,
    ...(await getContent(widgetType)),
    port: port
  })
})

expressApp.get("/autoload", (req, res) => {
  const { selector, widget, resource } = req.query as { selector: string; widget: string; resource: string }

  if (!selector) {
    return res.status(400).send("selector is required")
  }

  if (!widget) {
    return res.status(400).send("widget is required")
  }

  if (!resource) {
    return res.status(400).send("resource is required")
  }

  const resourceWithoutSymbols = stripSymbols(resource)
  const widgetTypeWithoutSymbols = stripSymbols(widget)
  const widgetSrc = `dist/widgets/${widgetTypeWithoutSymbols}/widget.${resourceWithoutSymbols}`
  const code = readFileSync(widgetSrc, "utf8")

  if (resourceWithoutSymbols === "css") {
    res.set("Content-Type", "text/css")
  }

  if (resourceWithoutSymbols === "js") {
    res.set("Content-Type", "text/javascript")
  }

  res.set("Cache-Control", "public, max-age=300")

  res.render("autoload", {
    selector: stripSymbolsThatAreNotDash(selector),
    code,
    isJsCode: resourceWithoutSymbols === "js"
  })
})

export default expressApp
