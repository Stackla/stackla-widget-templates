import { SdkSwiper } from "types"

declare const sdk: SdkSwiper

import { loadWidget } from "@stackla/widget-utils"
import { initializeInlineSwiperListeners } from "./inline-swiper.loader"
import shopspotStyle from "../styles/templates/shopspot-icon/styles.scss"

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
  templates: {
    "expanded-tiles": {
      styles: [
        {
          css: shopspotStyle,
          global: true
        }
      ]
    }
  }
})

sdk.querySelector(".track")?.style.removeProperty("display")
