import { Sdk } from "types"

declare const sdk: Sdk

import { loadWidget } from "@stackla/widget-utils"
import ProductsTemplate from "@widgets/nosto-two/templates/products.template"
import { initializeSwiperForInlineStoryTiles, onTilesUpdated } from "./inline-story-swiper.loader"
import { InlineProductsTemplate } from "@widgets/nosto-two/templates/inline-products.template"
import { TileContentTemplate } from "@widgets/nosto-two/templates/tile-content.template"
import { config } from "../nosto-two/config"
import { StoryExpandedTiles } from "@widgets/nosto-two/templates/base.template"

// dimensions from Figma design
const tileSizeSettings = {
  small: "50px",
  medium: "100px",
  large: "150px"
}

loadWidget(sdk, {
  features: {
    addNewTilesAutomatically: false,
    handleLoadMore: false,
    tileSizeSettings,
    cssVariables: {
      "--navigation-arrow-display": sdk.isPaginationEnabled() && !sdk.isScrollWidget() ? "flex" : "none"
    }
  },
  callbacks: {
    onTilesUpdated: [onTilesUpdated]
  },
  templates: {
    "expanded-tiles": StoryExpandedTiles,
    "ugc-products": ProductsTemplate,
    "inline-products": InlineProductsTemplate,
    "tile-content": TileContentTemplate
  },
  config
})

initializeSwiperForInlineStoryTiles()

sdk.querySelector(".track")?.style.removeProperty("display")
