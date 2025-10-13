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
import { createMockRoutes, STAGING_UI_URL } from "../../tests/libs/developer"
import fs from "fs"
import { Request, Response } from 'express';
import { PreviewContent, IDraftRequest } from "./interfaces"
import apicache from 'apicache';

export function getDomain(env = process.env.APP_ENV) {
  if (env === "local" || env == "development") {
    return `${STAGING_UI_URL}/local`;
  }

  if (env === "testing") {
    return `${STAGING_UI_URL}/external-testing`
  }

  if (env === "production") {
    return STAGING_UI_URL
  }

  if (env === "pipeline") {
    return "http://localhost:4003/assets/widget-core"
  }

  return `${STAGING_UI_URL}/local`
}

const expressApp = express()
const cache = apicache.middleware;
expressApp.use(express.static("dist", { redirect: false }))
expressApp.use((_req, res, next) => {
  res.set("Cache-Control", ["public, max-age=300"])
  next()
})
expressApp.use(cache("5 minutes"));
expressApp.engine("hbs", Handlebars.__express)
expressApp.set("view engine", "hbs")
expressApp.use(cors())
expressApp.use(cookieParser())

createMockRoutes(expressApp)


export function determineEnvironment(req: Request) {
  if (req.query.dev === "true") {
    return "development"
  }

  return process.env.APP_ENV || "production"
}

export async function getContent(widgetType: string) : Promise<PreviewContent> {
  const rootDir = path.resolve(__dirname, `../../../../../dist/${widgetType}`)

  const layout = `${rootDir}/layout.hbs`
  const tile = `${rootDir}/tile.hbs`
  const css = `${rootDir}/widget.css`
  const js = `${rootDir}/widget.js`

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
}

async function getHTML(content: PreviewContent, request: Request) {
  return await getAndRenderTiles(
    {
      custom_templates: {
        layout: {
          template: content.layoutCode || ""
        },
        tile: {
          template: content.tileCode || ""
        }
      },
      custom_css: content.cssCode || "",
      custom_js: content.jsCode || "",
      widgetOptions: widgetOptions
    },
    request
  )
}

expressApp.get(
  "/development/products/asus-tuf-f15-15-6-fhd-144hz-gaming-laptop-1tbgeforce-rtx-3050.js",
  (_req, res) => {
    const fileData = fs.readFileSync(path.resolve("./mock/atc-laptop.json"), "utf-8")
    res.json(JSON.parse(fileData))
  }
)

expressApp.get("/development/products/samsung-98-qn90d-neo-qled-4k-smart-tv-2024.js", (_req, res) => {
  const fileData = fs.readFileSync(path.resolve("./mock/atc-tv.json"), "utf-8")
  res.json(JSON.parse(fileData))
})

expressApp.get("/development/products/contrast-felted-sweater-black.js", (_req, res) => {
  const fileData = fs.readFileSync(path.resolve("./mock/contrast-felted-sweater-black.json"), "utf-8")
  res.json(JSON.parse(fileData))
})

expressApp.get("/development/products/desna-dress.js", (_req, res) => {
  const fileData = fs.readFileSync(path.resolve("./mock/desna-dress.json"), "utf-8")
  res.json(JSON.parse(fileData))
})

expressApp.get("/development/products/pure-city-vintage-leather-saddle.js", (_req, res) => {
  const fileData = fs.readFileSync(path.resolve("./mock/pure-city-vintage-leather-saddle.json"), "utf-8")
  res.json(JSON.parse(fileData))
})

function mutateStylesForCustomWidgets(widgetType: string) {
  const widgetOptionsMutated = { ...widgetOptions }

  switch (widgetType) {
    case "nightfall":
      widgetOptionsMutated.style!.text_tile_background = "000000"
      widgetOptionsMutated.style!.text_tile_font_color = "fff"
      widgetOptionsMutated.style!.text_tile_user_name_font_color = "fff"
      widgetOptionsMutated.style!.cta_btn_background = "fff"
      widgetOptionsMutated.style!.cta_btn_font_color = "000000"
      widgetOptionsMutated.style!.text_tile_user_name_font_color = "fff"
      // @TODO: Peng to add cta_background_color and cta_font_color
      break
    case "slider":
      widgetOptionsMutated.style!.text_tile_background = "000000"
      widgetOptionsMutated.style!.text_tile_user_name_font_color = "fff"
      break
  }

  return widgetOptionsMutated
}

expressApp.post("/development/widgets/:wid/draft", async (req, res) => {
  const body = JSON.parse(req.body)
  const draft = body.draft as IDraftRequest
  const html = await renderTemplates(draft, req)
  const customCss = draft.customCSS
  const customJs = draft.customJS

  const widgetOptionsMutated = mutateStylesForCustomWidgets(req.cookies.widgetType as string)

  res.send({
    html,
    customCSS: customCss,
    customJS: customJs,
    widgetOptions: widgetOptionsMutated,
    stackId: 1451,
    merchantId: "shopify-64671154416",
    tileCount: tiles.length,
    enabled: 1
  })
})

expressApp.get("/development/widgets/:wid/tiles", async (req, res) => {
  if (req.query.after_id) {
    res.send(getTilesToRender(req).slice(0, 1).map(tile => ({
        ...tile,
        id: "1"
      })))

    return
  }

  res.send(getTilesToRender(req))
})

expressApp.get("/development/widgets/:wid/tiles/:tid", async (req, res) => {
  res.json(tiles.find(tile => tile.id === req.params.tid))
})

expressApp.get("/development/widgets/:wid/rendered/tiles", async (req, res) => {
  const content = await getContent(req.query.widgetType as string);
  const tileHtml = await getHTML(content, req)

  if (req.query.after_id) {
    res.json(tileHtml.slice(0, 1).map(tile => {
      tile = tile.replace(`data-id=\"65e16a0b5d7e676caec68f03\"`, `data-id=\"1\"`);
      return tile;
    }));
    return;
  }

  res.json(tileHtml)
})

expressApp.get("/development/stackla/cs/image/disable", async (req, res) => {
  res.json({ success: true })
})

// Register preview route
expressApp.get("/preview", async (req : Request, res: Response) => {
  const widgetRequest = req.query
  const widgetType = req.query.widgetType as string
  const dev = req.query.dev

  if (dev) {
    if (!req.query.wid) {
      res.status(400).send("wid query parameter is required. Please search through widget list to find the id you wish to use")
      return;
    }
  }

  res.render("preview", {
    widgetRequest: JSON.stringify(widgetRequest),
    widgetType,
    widgetOptions: JSON.stringify(widgetOptions),
    domain: getDomain(determineEnvironment(req)),
    wid: req.query.wid ?? "668ca52ada8fb",
    ...(await getContent(req.query.widgetType as string))
  })
})

expressApp.get("/multi-preview", async (req : Request, res: Response) => {
  const widgetRequest = req.query
  const widgetType = req.query.widgetType as string

  res.render("multi-preview", {
    widgetRequest: JSON.stringify(widgetRequest),
    widgetType,
    widgetOptions: JSON.stringify(widgetOptions),
    domain: getDomain(determineEnvironment(req)),
    ...(await getContent(widgetType))
  })
})

expressApp.get("/staging", async (req : Request, res : Response) => {
  const widgetRequest = req.query
  const widgetType = req.query.widgetType as string

  res.render("staging", {
    widgetRequest: JSON.stringify(widgetRequest),
    widgetType,
    widgetOptions: JSON.stringify(widgetOptions.config),
    domain: getDomain(determineEnvironment(req)),
    ...(await getContent(widgetType))
  })
})

export default expressApp
