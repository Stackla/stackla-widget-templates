import { Hono } from "hono"
import { cors } from "hono/cors"
import path from "path"
import { readFileSync } from "fs"
import * as Handlebars from "hbs"
import { getAndRenderTiles, getTilesToRender, renderTemplates } from "./tile.handlers"
import widgetOptions from "../../tests/fixtures/widget.options"
import tiles from "../../tests/fixtures/tiles"
import { createMockRoutes, STAGING_UI_URL } from "../../tests/libs/developer"
import fs from "fs"
import { PreviewContent, IDraftRequest } from "./interfaces"

export function getDomain(env = process.env.APP_ENV) {
  if (env === "local" || env == "development") {
    return `${STAGING_UI_URL}/local`
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

const app = new Hono()

// CORS middleware
app.use("/*", cors())

// Cache middleware
app.use("/*", async (c, next) => {
  c.header("Cache-Control", "public, max-age=300")
  await next()
})

// Static file serving middleware - this needs to be handled by the serverless adapter
// For now we'll let the serverless-http wrapper handle static files

// Handlebars setup
Handlebars.registerPartials(path.join(__dirname, "../../../views/partials"))

// Cookie parsing middleware
app.use("/*", async (c, next) => {
  // Simple cookie parsing - can be enhanced if needed
  const cookies: Record<string, string> = {}
  const cookieHeader = c.req.header("cookie")
  if (cookieHeader) {
    cookieHeader.split(";").forEach(cookie => {
      const [name, value] = cookie.trim().split("=")
      if (name && value) {
        cookies[name] = decodeURIComponent(value)
      }
    })
  }
  c.set("cookies", cookies)
  await next()
})

// Create mock routes function that works with Hono
createMockRoutes(app)

export function determineEnvironment(c: { req: { query: () => Record<string, string | string[]> } }) {
  const query = c.req.query()
  if (query.dev === "true") {
    return "development"
  }

  return process.env.APP_ENV || "production"
}

export async function getContent(widgetType: string): Promise<PreviewContent> {
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
      .replace(/\\\\/g, "\\\\\\\\")
      .replace(/"/g, '\\"')
      .replace(/\\n/g, "\\\\n")
      .replace(/\\r/g, "\\\\r")
      .replace(/\\t/g, "\\\\t")
  }
}

async function getHTML(
  content: PreviewContent,
  request: {
    query: Record<string, string | string[]>
    cookies?: Record<string, string>
  }
) {
  return getAndRenderTiles(
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

// Route handlers
app.get("/development/products/asus-tuf-f15-15-6-fhd-144hz-gaming-laptop-1tbgeforce-rtx-3050.js", c => {
  const fileData = fs.readFileSync(path.resolve("src/tests/mock/atc-laptop.json"), "utf-8")
  return c.json(JSON.parse(fileData))
})

app.get("/development/products/samsung-98-qn90d-neo-qled-4k-smart-tv-2024.js", c => {
  const fileData = fs.readFileSync(path.resolve("src/tests/mock/atc-tv.json"), "utf-8")
  return c.json(JSON.parse(fileData))
})

app.get("/development/products/contrast-felted-sweater-black.js", c => {
  const fileData = fs.readFileSync(path.resolve("src/tests/mock/contrast-felted-sweater-black.json"), "utf-8")
  return c.json(JSON.parse(fileData))
})

app.get("/development/products/desna-dress.js", c => {
  const fileData = fs.readFileSync(path.resolve("src/tests/mock/desna-dress.json"), "utf-8")
  return c.json(JSON.parse(fileData))
})

app.get("/development/products/pure-city-vintage-leather-saddle.js", c => {
  const fileData = fs.readFileSync(path.resolve("src/tests/mock/pure-city-vintage-leather-saddle.json"), "utf-8")
  return c.json(JSON.parse(fileData))
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
      // @TODO: Peng to add cta_background_color and cta_font_color
      break
    case "slider":
      widgetOptionsMutated.style!.text_tile_background = "000000"
      widgetOptionsMutated.style!.text_tile_user_name_font_color = "fff"
      break
  }

  return widgetOptionsMutated
}

app.post("/development/widgets/:wid/draft", async c => {
  const body = await c.req.json()
  const draft = body.draft as IDraftRequest
  const cookies = c.get("cookies") as Record<string, string>

  // Create a request-like object for getTilesToRender
  const request = {
    query: c.req.query(),
    cookies
  }

  const html = await renderTemplates(draft, request)
  const customCss = draft.customCSS
  const customJs = draft.customJS

  const widgetOptionsMutated = mutateStylesForCustomWidgets(cookies.widgetType || "")

  return c.json({
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

app.get("/development/widgets/:wid/tiles", async c => {
  const query = c.req.query()
  const request = { query, cookies: c.get("cookies") }

  if (query.after_id) {
    const result = getTilesToRender(request)
      .slice(0, 1)
      .map(tile => ({
        ...tile,
        id: "1"
      }))
    return c.json(result)
  }

  return c.json(getTilesToRender(request))
})

app.get("/development/widgets/:wid/tiles/:tid", async c => {
  const tid = c.req.param("tid")
  const tile = tiles.find(tile => tile.id === tid)
  return c.json(tile)
})

app.get("/development/widgets/:wid/rendered/tiles", async c => {
  const query = c.req.query()
  const request = { query, cookies: c.get("cookies") }

  const content = await getContent(query.widgetType as string)
  const tileHtml = await getHTML(content, request)

  if (query.after_id) {
    const result = tileHtml.slice(0, 1).map(tile => {
      tile = tile.replace('data-id="65e16a0b5d7e676caec68f03"', 'data-id="1"')
      return tile
    })
    return c.json(result)
  }

  return c.json(tileHtml)
})

app.get("/development/stackla/cs/image/disable", async c => {
  return c.json({ success: true })
})

// Helper function to render templates with Hono context
async function renderTemplate(template: string, data: Record<string, unknown>): Promise<string> {
  return new Promise((resolve, reject) => {
    Handlebars.renderFile(
      path.join(__dirname, "../../../views", template + ".hbs"),
      data,
      (err: Error | null, html: string) => {
        if (err) {
          reject(err)
        } else {
          resolve(html)
        }
      }
    )
  })
}

// Register preview route
app.get("/preview", async c => {
  const query = c.req.query()
  const widgetType = query.widgetType as string
  const dev = query.dev

  if (dev) {
    if (!query.wid) {
      c.status(400)
      return c.text("wid query parameter is required. Please search through widget list to find the id you wish to use")
    }
  }

  const templateData = {
    widgetRequest: JSON.stringify(query),
    widgetType,
    widgetOptions: JSON.stringify(widgetOptions),
    domain: getDomain(determineEnvironment(c)),
    wid: query.wid ?? "668ca52ada8fb",
    ...(await getContent(query.widgetType as string))
  }

  const html = await renderTemplate("preview", templateData)
  return c.html(html)
})

app.get("/multi-preview", async c => {
  const query = c.req.query()
  const widgetType = query.widgetType as string

  const templateData = {
    widgetRequest: JSON.stringify(query),
    widgetType,
    widgetOptions: JSON.stringify(widgetOptions),
    domain: getDomain(determineEnvironment(c)),
    ...(await getContent(widgetType))
  }

  const html = await renderTemplate("multi-preview", templateData)
  return c.html(html)
})

app.get("/staging", async c => {
  const query = c.req.query()
  const widgetType = query.widgetType as string

  const templateData = {
    widgetRequest: JSON.stringify(query),
    widgetType,
    widgetOptions: JSON.stringify(widgetOptions.config),
    domain: getDomain(determineEnvironment(c)),
    ...(await getContent(widgetType))
  }

  const html = await renderTemplate("staging", templateData)
  return c.html(html)
})

export default app
