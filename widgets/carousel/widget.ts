import type { Sdk } from "@stackla/ugc-widgets"
import { getConfig } from "./widget.config"
import { ExpandedTiles } from "./components/expanded-tile/base.template"
import expandedTileStyle from "./components/expanded-tile/base.scss"
import productsStyle from "./components/products/base.scss"
import shopspotStyle from "./components/shopspot-icon/base.scss"
import swiperFont from "./swiper-font.scss"
import swiperCommon from "./swiper-common.scss"
import icons from "../../uikit/icon.scss"
import swiperBundleCss from "@swiper/swiper-bundle.css"

import {
  onTileExpand,
  initializeInlineSwiperListeners,
  onTileClosed,
  hideSlidesWithInvisibleTiles,
  onPreloadTileHidden
} from "./widget.extensions"
import {
  registerPreloadTileHidden,
  registerTilesUpdated,
  registerWidgetInitComplete
} from "widgets/libs/tile.listeners"
import {
  addAutoAddTileFeature,
  loadExpandedTileFeature,
  loadHoverTile,
  loadTitle,
  loadWidgetIsEnabled
} from "widgets/libs/widget.features"
import { addCSSVariablesToPlacement } from "widgets/libs/widget.layout"
import getCSSVariables from "widgets/libs/css-variables"

declare const sdk: Sdk
sdk.tiles.preloadImages = true
sdk.tiles.setLoadMode("page")
sdk.tiles.setVisibleTilesCount(100)

const widgetContainer = sdk.placement.getWidgetContainer()
const widgetSettings = getConfig(widgetContainer)

loadWidgetIsEnabled(widgetSettings)
addCSSVariablesToPlacement(getCSSVariables(widgetSettings))
loadTitle()
registerWidgetInitComplete(initializeInlineSwiperListeners)
addAutoAddTileFeature(widgetSettings)
loadExpandedTileFeature(widgetSettings, onTileExpand, onTileClosed)
loadHoverTile(widgetSettings)
registerTilesUpdated(hideSlidesWithInvisibleTiles)
registerPreloadTileHidden(onPreloadTileHidden)

sdk.addWidgetCustomStyles(swiperFont)

sdk.addSharedCssCustomStyles(swiperBundleCss)
sdk.addSharedCssCustomStyles(icons)
sdk.addSharedCssCustomStyles(swiperCommon)
sdk.addSharedCssCustomStyles(shopspotStyle)

sdk.addCSSToComponent(expandedTileStyle, "expanded-tiles")
sdk.addCSSToComponent(productsStyle, "ugc-products")
sdk.addTemplateToComponent(ExpandedTiles, "expanded-tiles")
