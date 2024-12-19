import { Sdk } from "types"

declare const sdk: Sdk

import { loadWidget } from "@stackla/widget-utils"
import { initializeSwiperForInlineStoryTiles, onTilesUpdated } from "./inline-story-swiper.loader"

// dimensions from Figma design
const tileSizeSettings = {
  small: "50px",
  medium: "100px",
  large: "150px"
}

loadWidget({
  extensions: {
    swiper: true
  },
  features: {
    handleLoadMore: false,
    tileSizeSettings
  },
  callbacks: {
    onLoad: [initializeSwiperForInlineStoryTiles],
    onTilesUpdated: [onTilesUpdated]
  }
})

sdk.querySelector(".track")?.style.removeProperty("display")
