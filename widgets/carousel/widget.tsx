import { SdkSwiper } from "types"
import { loadWidget } from "@stackla/widget-utils"
import { initializeInlineSwiperListeners } from "./inline-swiper.loader"

declare const sdk: SdkSwiper

loadWidget({
  extensions: {
    swiper: true
  },
  features: {
    handleLoadMore: false
  },
  callbacks: {
    onLoad: [initializeInlineSwiperListeners]
  },
  templates: {}
})

sdk.querySelector(".track")?.style.removeProperty("display")
