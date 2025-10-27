import { Sdk } from "types"

declare const sdk: Sdk

import { loadWidget } from "@stackla/widget-utils"
import { initializeInlineSwiperListeners } from "./inline-shortvideo-swiper.loader"
import { ExpandedTilesTemplate } from "@widgets/storyline/templates/expanded-tile.template"
import { ProductsTemplate } from "@widgets/storyline/templates/products.template"

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
    "expanded-tiles": ExpandedTilesTemplate,
    "ugc-products": ProductsTemplate
  }
})

sdk.querySelector(".track")?.style.removeProperty("display")

initializeInlineSwiperListeners()
