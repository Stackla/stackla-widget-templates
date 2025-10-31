import { ISdk } from "types"
import { initializeInlineSwiper } from "../utils/inline-swiper.loader"

declare const sdk: ISdk

export function initializeInlineSwiperListeners() {
  initializeInlineSwiper({
    widgetName: "carousel",
    widgetClass: "carousel-inline",
    swiperId: "inline-carousel",
    initialLoop: false,
    sdk
  })
}
