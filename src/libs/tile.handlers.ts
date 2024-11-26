import tiles from "../../tests/fixtures/tiles"
import type { IDraftRequest } from "./express"
import { renderHTMLWithTemplates, renderTilesWithTemplate } from "@stackla/handlebars"

export function getTilesToRender(page: number, limit: number) {
  const startIndex = limit * (page - 1)
  const endIndex = limit * page
  return tiles.slice(startIndex, endIndex)
}

export async function getAndRenderTiles(widgetContainer: IDraftRequest, page: number = 1, limit: number = 25) {
  const tileTemplate = widgetContainer.customTemplates.tile.template
  return renderTilesWithTemplate(tileTemplate, getTilesToRender(page, limit), widgetContainer.widgetOptions)
}

export async function renderTemplates(widgetContainer: IDraftRequest, page: number = 1, limit: number = 25) {
  const tileTemplate = widgetContainer.customTemplates.tile.template
  const layoutTemplate = widgetContainer.customTemplates.layout.template
  const widgetSettings = {
    customCSS: widgetContainer.customCSS,
    customJS: widgetContainer.customJS,
    widgetOptions: JSON.parse(widgetContainer.widgetOptions)
  }
  return renderHTMLWithTemplates(tileTemplate, layoutTemplate, getTilesToRender(page, limit), widgetSettings)
}
