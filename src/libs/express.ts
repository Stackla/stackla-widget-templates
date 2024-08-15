import express from "express"
import "hbs"
import { WidgetRequest } from "@stackla/ugc-widgets"
import cors from "cors"
import path from "path"
import { readFileSync } from "fs"
import * as hbs from "hbs"

const expressApp = express()
expressApp.use((_req, res, next) => {
  res.set("Cache-Control", "public, max-age=300")
  next()
})
expressApp.use(express.static("dist/widgets", { redirect: false }))
expressApp.engine("hbs", hbs.__express)
expressApp.set("view engine", "hbs")
expressApp.use(cors())
expressApp.use(
  "/sscripts",
  express.static(path.join(__dirname, "../../../../../node_modules/@stackla/ugc-widgets/dist/"))
)
expressApp.use("/swiper", express.static(path.join(__dirname, "../../../../../node_modules/swiper/")))

const stripSymbols = (str: string) => str.replace(/[^a-zA-Z0-9]/g, "")
const stripSymbolsThatAreNotDash = (str: string) => str.replace(/[^a-zA-Z0-9-]/g, "")

// Register preview route
expressApp.get("/preview", (req, res) => {
  const widgetRequest = req.query as WidgetRequest
  const widgetType = req.query.widgetType
  if (!widgetType) {
    return res.status(400).send("widgetType is required")
  }

  const rootDir = path.resolve(__dirname, `../../../../../dist/widgets/${widgetType}`)

  const layout = `${rootDir}/layout.hbs`
  const tile = `${rootDir}/tile.hbs`
  const css = `${rootDir}/widget.css`
  const js = `${rootDir}/widget.js`

  const layoutFileContents = readFileSync(layout, "utf8")
  const tileFileContents = readFileSync(tile, "utf8")
  const cssFileContents = readFileSync(css, "utf8")
  const jsFileContents = readFileSync(js, "utf8")

  res.render("preview", {
    widgetRequest: JSON.stringify(widgetRequest),
    layoutCode: layoutFileContents,
    tileCode: tileFileContents,
    cssCode: cssFileContents,
    jsCode: jsFileContents
      .replace(/\\/g, "\\\\")
      .replace(/\"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t")
  })
})

expressApp.get("/autoload", (req, res) => {
  const { selector, widget, resource } = req.query as { selector: string, widget: string, resource: string }

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
});

export default expressApp
