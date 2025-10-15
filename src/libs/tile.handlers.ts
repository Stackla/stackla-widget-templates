import tiles from "../../tests/fixtures/tiles"
import type { IDraftRequest } from "./interfaces"
import { renderHTMLWithTemplates, renderTilesWithTemplate } from "@stackla/widget-utils/handlebars"

// Generic request interface that works with both Express and Hono
interface GenericRequest {
  query: Record<string, string | string[]>
  cookies?: Record<string, string>
}

export function getTilesToRender(req: GenericRequest) {
  const page = (req.query.page ?? 0) as number
  const limit = (req.query.limit ?? 25) as number
  const startIndex = limit * (page - 1)
  const endIndex = limit * page
  const mutatedTiles = tiles.slice(startIndex, endIndex)

  const search = req.query.search as string
  if (search) {
    const searchFields = ["title", "description", "original_url", "source"]
    return mutatedTiles.filter(tile => {
      return searchFields.some(field => {
        const tileField = tile[field] as string
        if (!tileField) {
          return false
        }
        return tileField.toLowerCase().includes(search.toLowerCase())
      })
    })
  }
  return mutatedTiles
}

export async function getAndRenderTiles(widgetContainer: IDraftRequest, request) {
  const tileTemplate = widgetContainer.custom_templates.tile.template
  return renderTilesWithTemplate(tileTemplate, getTilesToRender(request), widgetContainer.widgetOptions)
}

export async function renderTemplates(widgetContainer: IDraftRequest, request) {
  const tileTemplate = widgetContainer.custom_templates.tile.template
  const layoutTemplate = widgetContainer.custom_templates.layout.template
  const widgetSettings = {
    customCSS: widgetContainer.custom_css,
    customJS: widgetContainer.custom_js,
    widgetOptions: JSON.parse(widgetContainer.widgetOptions)
  }
  return renderHTMLWithTemplates(tileTemplate, layoutTemplate, getTilesToRender(request), widgetSettings.widgetOptions)
}
