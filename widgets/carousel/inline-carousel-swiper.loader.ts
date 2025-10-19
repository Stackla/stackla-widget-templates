import { Sdk } from "types"
import { initializeInlineSwiper } from "../utils/inline-swiper.loader"

declare const sdk: Sdk

export function initializeInlineSwiperListeners() {
  initializeInlineSwiper({
    widgetName: "carousel",
    widgetClass: "carousel-inline",
    swiperId: "inline-carousel",
    initialLoop: false,
    sdk
  })
}
