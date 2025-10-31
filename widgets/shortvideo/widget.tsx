import { ISdk } from "types"

declare const sdk: ISdk

import { loadWidget, MyWidgetSettings } from "@stackla/widget-utils"
import { initializeInlineSwiperListeners } from "./inline-shortvideo-swiper.loader"

const config: MyWidgetSettings = {
  features: {
    addNewTilesAutomatically: false,
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
  config: {
    expandedTile: {
      expanded_tile_variant: "vertical"
    }
  }
}

loadWidget(sdk, config)

sdk.querySelector(".track")?.style.removeProperty("display")

initializeInlineSwiperListeners()
