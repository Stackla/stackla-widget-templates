import { Sdk } from "types"

declare const sdk: Sdk

import { loadWidget } from "@stackla/widget-utils"
import { initializeInlineSwiperListeners } from "./inline-carousel-swiper.loader"

loadWidget(sdk, {
  extensions: {
    swiper: true
  },
  features: {
    handleLoadMore: false,
    cssVariables: {
      "--navigation-arrow-display": sdk.isPaginationEnabled() && !sdk.isScrollWidget() ? "flex" : "none"
    }
  }
})

sdk.querySelector(".track")?.style.removeProperty("display")

initializeInlineSwiperListeners()
