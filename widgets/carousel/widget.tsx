import { SdkSwiper } from "types"

declare const sdk: SdkSwiper

import { loadWidget } from "@stackla/widget-utils"
import { initializeInlineSwiperListeners } from "./inline-swiper.loader"
import shopspotStyle from "./components/shopspot-icon/base.scss"

loadWidget({
  extensions: {},
  features: {
    handleLoadMore: false
  },
  callbacks: {
    onLoad: [initializeInlineSwiperListeners]
  },
  templates: {
    "expanded-tiles": {
      style: {
        css: shopspotStyle,
        global: true
      }
    }
  }
})

sdk.querySelector(".track")?.style.removeProperty("display")
