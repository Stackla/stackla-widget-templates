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

export function getDomain(isDev: boolean) {
  if (isDev) {
    return "http://localhost:4002/development"
  }

  if (process.env.APP_ENV === "testing") {
    return `${STAGING_UI_URL}/external-testing`
  }

  if (process.env.APP_ENV === "production") {
    return STAGING_UI_URL
  }

  return `${STAGING_UI_URL}/local`
}

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
  customJS: string
  widgetOptions: typeof widgetOptions.config
}

type PreviewContent = {
  layoutCode: string
  tileCode: string
  cssCode: string
  jsCode: string
}

const expressApp = express()
expressApp.use(express.static("dist", { redirect: false }))

if (process.env.APP_ENV == "staging" || process.env.APP_ENV == "production") {
  expressApp.use((_req, res, next) => {
    res.set("Cache-Control", ["public, max-age=3600"])
    next()
  })
}

expressApp.use(function (req, res, next) {
  res.removeHeader("x-powered-by");
  next();
});

expressApp.engine("hbs", Handlebars.__express)
expressApp.set("view engine", "hbs")
expressApp.use(cors())
expressApp.use(cookieParser())

createMockRoutes(expressApp)

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

expressApp.use("/preview", (req : Request, res : Response, next) => {
  const widgetType = req.query.widgetType
  if (!widgetType) {
    res.status(400).send("widgetType query parameter is required")
  } else {
    res.cookie("widgetType", widgetType, { maxAge: 360000 })
    next()
  }
})

export async function getContent(widgetType: string, retry = 0): Promise<PreviewContent> {
  if (retry > 10) {
    throw new Error(`Failed to get content, exiting after 10 retries, widgetType: ${widgetType}`)
  }

  const rootDir = path.resolve(__dirname, `../../../../../dist/${widgetType}`)

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
    console.error(e)
    await new Promise(resolve => setTimeout(resolve, 3000))

    return getContent(widgetType, retry + 1)
  }
}

async function getHTML(content: PreviewContent, request: Request) {
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
      widgetOptionsMutated.style.text_tile_background = "000000"
      widgetOptionsMutated.style.text_tile_font_color = "fff"
      widgetOptionsMutated.style.text_tile_user_name_font_color = "fff"
      widgetOptionsMutated.style.shopspot_btn_background = "fff"
      widgetOptionsMutated.style.shopspot_btn_font_color = "000000"
      // @TODO: Peng to add cta_background_color and cta_font_color
      break
    case "slider":
      widgetOptionsMutated.style.text_tile_background = "000000"
      widgetOptionsMutated.style.text_tile_user_name_font_color = "fff"
      break
  }

  return widgetOptionsMutated
}

expressApp.post("/development/widgets/668ca52ada8fb/draft", async (req, res) => {
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

expressApp.get("/development/widgets/668ca52ada8fb", async (req, res) => {
  const content = await getContent(req.cookies.widgetType as string)

  const widgetOptionsMutated = mutateStylesForCustomWidgets(req.cookies.widgetType as string)

  res.json({
    html: await getHTML(content, req),
    customCSS: content.cssCode,
    customJS: content.jsCode,
    widgetOptions: widgetOptionsMutated,
    merchantId: "shopify-64671154416",
    stackId: 1451,
    tileCount: tiles.length
  })
})

expressApp.get("/development/widgets/668ca52ada8fb/tiles", async (req, res) => {
  if (req.query.after_id) {
    res.send({
      tiles: getTilesToRender(req).slice(0, 1).map(tile => ({
        ...tile,
        id: "1"
      }))
    })

    return
  }

  res.send({
    tiles: getTilesToRender(req)
  })
})

expressApp.get("/development/widgets/668ca52ada8fb/tiles/:tid", async (req, res) => {
  res.json(tiles.find(tile => tile.id === req.params.tid))
})

expressApp.get("/development/widgets/668ca52ada8fb/rendered/tiles", async (req, res) => {
  const widgetType = req.cookies.widgetType as string
  const tileHtml = await getHTML(await getContent(widgetType), req)

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

  res.render("preview", {
    widgetRequest: JSON.stringify(widgetRequest),
    widgetType,
    widgetOptions: JSON.stringify(widgetOptions),
    domain: getDomain(req.query.dev === "true"),
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
    domain: getDomain(req.query.dev === "true"),
    ...(await getContent(widgetType))
  })
})

export default expressApp
