import type { Sdk } from "@stackla/ugc-widgets"
import Swiper from "swiper"

export interface SdkSwiper extends Sdk {
  swiperInline?: Swiper
  swiperExpanded?: Swiper
}
