import { Sdk } from "types"

declare const sdk: Sdk

import { loadWidget } from "@stackla/widget-utils"
import { initializeInlineSwiperListeners } from "./inline-shortvideo-swiper.loader"

loadWidget({
  extensions: {
    swiper: true
  },
  features: {
    handleLoadMore: false
  },
  config: {
    filter: {
      media: "short"
    }
  }
})

sdk.querySelector(".track")?.style.removeProperty("display")

initializeInlineSwiperListeners()
