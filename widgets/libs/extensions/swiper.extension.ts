import Swiper from "swiper"
import { SdkSwiper } from "types"
import { Manipulation, Navigation } from "swiper/modules"

declare const sdk: SdkSwiper

export type SwiperMode = "swiperInline" | "swiperExpanded"

export type SwiperProps = {
  widgetSelector: HTMLElement
  prevButton?: string
  nextButton?: string
  perView: number
  mode?: SwiperMode
}

export function initializeSwiper({
  widgetSelector,
  perView,
  mode = "swiperInline",
  prevButton = "swiper-button-prev",
  nextButton = "swiper-button-next"
}: SwiperProps) {
  const prev = widgetSelector!.parentNode!.querySelector<HTMLElement>(`.${prevButton}`)
  const next = widgetSelector!.parentNode!.querySelector<HTMLElement>(`.${nextButton}`)

  if (!prev || !next) {
    throw new Error("Missing swiper Navigation elements for previous and next navigation")
  }

  sdk[mode]?.destroy(true)

  sdk[mode] = new Swiper(widgetSelector, {
    modules: [Navigation, Manipulation],
    slidesPerView: perView,
    spaceBetween: 10,
    hashNavigation: true,
    observeParents: true,
    observer: true,
    loop: true,
    direction: "horizontal",
    noSwiping: true,
    navigation: {
      nextEl: next,
      prevEl: prev
    },
    on: {
      afterInit: swiper => {
        swiper.slideToLoop(0, 0, false)
      }
    }
  })
}

export function refreshSwiper(mode: SwiperMode) {
  sdk[mode]?.update()
}

export function disableSwiper(mode: SwiperMode) {
  if (sdk[mode]) {
    sdk[mode].disable()
  }
}

export function enableSwiper(mode: SwiperMode) {
  if (sdk[mode]) {
    sdk[mode].enable()
  }
}
