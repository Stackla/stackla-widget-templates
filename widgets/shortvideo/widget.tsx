import { Sdk } from "types"

declare const sdk: Sdk

import { loadWidget } from "@stackla/widget-utils"
import { initializeInlineSwiperListeners } from "./inline-shortvideo-swiper.loader"
import ProductsTemplate from "../libs/vertical-expanded-tiles/products.template"
import { InlineProductsTemplate } from "../libs/vertical-expanded-tiles/inline-products.template"
import { TileContentTemplate } from "../libs/vertical-expanded-tiles/tile-content.template"
import { config } from "../libs/vertical-expanded-tiles/config"
import { StoryExpandedTiles } from "../libs/vertical-expanded-tiles/base.template"
loadWidget(sdk, {
  features: {
    handleLoadMore: false,
    tileSizeSettings: {
      small: "203px",
      medium: "281px",
      large: "409px"
    },
    tileWidthSettings: {
      small: "116.5px",
      medium: "158px",
      large: "229px"
    },
    cssVariables: {
      "--navigation-arrow-display": sdk.isPaginationEnabled() && !sdk.isScrollWidget() ? "flex" : "none"
    }
  },
  templates: {
    "expanded-tiles": StoryExpandedTiles,
    "ugc-products": ProductsTemplate,
    "inline-products": InlineProductsTemplate,
    "tile-content": TileContentTemplate
  },
  config
})

sdk.querySelector(".track")?.style.removeProperty("display")

initializeInlineSwiperListeners()
