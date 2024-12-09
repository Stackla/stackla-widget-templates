import { Sdk } from "types"

declare const sdk: Sdk

import { loadWidget } from "@stackla/widget-utils"
import { initializeInlineStorySwiperListeners } from "./inline-story-swiper.loader"

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
    onLoad: [initializeInlineStorySwiperListeners]
  }
})

sdk.querySelector(".track")?.style.removeProperty("display")
