import { Sdk } from "types"

declare const sdk: Sdk

import { loadWidget } from "@stackla/widget-utils"
import { ExpandedTilesTemplate } from "./templates/expanded-tile.template"
import { ProductsTemplate } from "./templates/products.template"
import { initializeSwiperForInlineStoryTiles, onTilesUpdated } from "./inline-story-swiper.loader"

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
    "expanded-tiles": ExpandedTilesTemplate,
    "ugc-products": ProductsTemplate
  }
})

initializeSwiperForInlineStoryTiles()

sdk.querySelector(".track")?.style.removeProperty("display")
