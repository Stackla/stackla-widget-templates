import { ISdk } from "types"

declare const sdk: ISdk

import { initializeSwiperForInlineStoryTiles, onTilesUpdated } from "./inline-story-swiper.loader"
import { loadWidget, MyWidgetSettings } from "@stackla/widget-utils"

// dimensions from Figma design
const tileSizeSettings = {
  small: "50px",
  medium: "100px",
  large: "150px"
}

const config: MyWidgetSettings = {
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
  }
}

loadWidget(sdk, config)

initializeSwiperForInlineStoryTiles()

sdk.querySelector(".track")?.style.removeProperty("display")
