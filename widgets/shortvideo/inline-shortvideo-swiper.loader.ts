import { ISdk } from "types"
import { initializeInlineSwiper } from "../utils/inline-swiper.loader"

declare const sdk: ISdk

export function initializeInlineSwiperListeners() {
  initializeInlineSwiper({
    widgetName: "shortvideo",
    widgetClass: "shortvideo-inline",
    swiperId: "inline-shortvideo",
    sdk
  })
}
