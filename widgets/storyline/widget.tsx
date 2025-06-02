import { Sdk } from "types"

declare const sdk: Sdk

import { loadWidget } from "@stackla/widget-utils"
import { initializeSwiperForInlineStoryTiles, onTilesUpdated } from "./inline-story-swiper.loader"
import { StoryExpandedTiles } from "./templates/base.template"

// dimensions from Figma design
const tileSizeSettings = {
  small: "50px",
  medium: "100px",
  large: "150px"
}

loadWidget(sdk, {
  extensions: {
    swiper: true
  },
  features: {
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
    "expanded-tiles": {
      template: StoryExpandedTiles
    }
  }
})

initializeSwiperForInlineStoryTiles()

sdk.querySelector(".track")?.style.removeProperty("display")
