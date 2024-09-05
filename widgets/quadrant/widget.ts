import { getConfig } from "./widget.config"
import type { Sdk } from "@stackla/ugc-widgets"
import {
  addAutoAddTileFeature,
  addLoadMoreButtonFeature,
  addTilesPerPageFeature,
  loadExpandedTileFeature,
  loadHoverTile,
  loadTitle
} from "../libs/widget.features"
import { loadExpandSettingComponents } from "../libs/widget.components"
import customExpandedTileTemplate from "./components/expanded-tile/base.template"
import customExpandedTileCSS from "./components/expanded-tile/styles.scss"
import customProductsCSS from "./components/products/styles.scss"
import getCSSVariables from "../libs/css-variables"
import { addCSSVariablesToPlacement } from "../libs/widget.layout"
import { initializeQuadrant } from "./quadrant.lib"

declare const sdk: Sdk

const widgetContainer = sdk.placement.getWidgetContainer()
const widgetSettings = getConfig(widgetContainer)
const groupsToShowInitially = 6

loadTitle()
loadExpandSettingComponents(widgetSettings)
loadHoverTile(widgetSettings)
addAutoAddTileFeature(widgetSettings)
loadExpandedTileFeature(widgetSettings)
addTilesPerPageFeature(widgetSettings)
addLoadMoreButtonFeature(widgetSettings)
addCSSVariablesToPlacement(getCSSVariables(widgetSettings))

sdk.tiles.preloadImages = true

sdk.tiles.setLoadMode("page")

sdk.addEventListener("tilesUpdated", initializeQuadrant)

const loadMoreButton = sdk.querySelector("#load-more")

if (!loadMoreButton) {
  throw new Error("Load more button not found")
}

loadMoreButton.addEventListener("click", () => {
  for (let i = 0; i < groupsToShowInitially; i++) {
    initializeQuadrant()
  }
})

sdk.addCSSToComponent(customExpandedTileCSS, "expanded-tile")
sdk.addCSSToComponent(customProductsCSS, "ugc-products")
sdk.addTemplateToComponent(customExpandedTileTemplate, "expanded-tile")
