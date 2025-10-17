import { Sdk } from "types"
import { initializeInlineSwiper } from "../utils/inline-swiper.loader"

declare const sdk: Sdk

export function initializeInlineSwiperListeners() {
  initializeInlineSwiper({
    widgetName: "shortvideo",
    widgetClass: "shortvideo-inline",
    swiperId: "inline-shortvideo",
    sdk
  })
}
