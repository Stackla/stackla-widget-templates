import { Sdk } from "types"

declare const sdk: Sdk

import { loadWidget } from "@stackla/widget-utils"
import ProductsTemplate from "../libs/vertical-expanded-tiles/products.template"
import { InlineProductsTemplate } from "../libs/vertical-expanded-tiles/inline-products.template"
import { TileContentTemplate } from "../libs/vertical-expanded-tiles/tile-content.template"
import { config } from "../libs/vertical-expanded-tiles/config"
import { StoryExpandedTiles } from "../libs/vertical-expanded-tiles/base.template"
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
    "expanded-tiles": StoryExpandedTiles,
    "ugc-products": ProductsTemplate,
    "inline-products": InlineProductsTemplate,
    "tile-content": TileContentTemplate
  },
  config
})

initializeSwiperForInlineStoryTiles()

sdk.querySelector(".track")?.style.removeProperty("display")
