import { StoryExpandedTiles } from "./templates/base.template"
import ProductsTemplate from "./products.template"
import { InlineProductsTemplate } from "./templates/inline-products.template"

declare const sdk: ISdk

import { type ISdk, loadWidget } from "@stackla/widget-utils"
import { initializeInlineSwiperListeners, mutateTilesOnce, observeMutations } from "../libs/nosto/inline-swiper"
import { config } from "./config"
import { TileContentTemplate } from "./templates/tile-content.template"

loadWidget(sdk, {
  extensions: {
    swiper: true
  },
  features: {
    handleLoadMore: false,
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
  config: {
    ...config
  }
})

const track = sdk.querySelector(".track")

track?.style.removeProperty("display")

const dialog = sdk.querySelector("#overlay-expanded-tiles")
dialog?.addEventListener("click", event => {
  if (dialog === event.target) {
    sdk.closeExpandedTiles()
  }
})

initializeInlineSwiperListeners()

if (track) {
  observeMutations(track, false)
  mutateTilesOnce(false)
}
