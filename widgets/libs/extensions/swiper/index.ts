import { Sdk } from "@stackla/ugc-widgets"
import swiperFont from "./swiper-font.scss"
import swiperCommon from "./swiper-common.scss"
import swiperBundleCss from "./swiper.scss"

declare const sdk: Sdk

export function loadSwiperStyles() {
  // some of the css styles are inherited across the shadow DOM components
  // https://www.w3.org/TR/CSS22/propidx.html#q0
  // Injects @font-face into placement head
  sdk.addWidgetCustomStyles(swiperFont)

  // Swiper specific styles to be available for both carousel and expanded tile
  sdk.addSharedCssCustomStyles(swiperBundleCss)
  sdk.addSharedCssCustomStyles(swiperCommon)
}
