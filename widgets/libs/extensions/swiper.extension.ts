import Swiper from "swiper"
import { ISdkSwiper } from "../../../types/ISdkSwiper"
import { Manipulation, Navigation, Pagination } from "swiper/modules"

declare const sdk: ISdkSwiper

export type SwiperMode = "swiperInline" | "swiperExpanded"

export function initializeSwiper(widgetSelector: HTMLElement, perView: number, mode: SwiperMode = "swiperInline") {
  const ugcContainer = sdk.querySelector("#nosto-ugc-container")
  const prev = ugcContainer!.querySelector<HTMLElement>(".swiper-button-prev")
  const next = ugcContainer!.querySelector<HTMLElement>(".swiper-button-next")
  const pagination = ugcContainer!.querySelector<HTMLElement>(".swiper-pagination")

  if (sdk[mode]) {
    sdk[mode].destroy(true, true)
  }

  sdk[mode] = new Swiper(widgetSelector, {
    modules: [Navigation, Pagination, Manipulation],
    slidesPerView: perView,
    spaceBetween: 10,
    centeredSlides: true,
    hashNavigation: true,
    loop: true,
    direction: "horizontal",
    observeParents: true,
    observer: true,
    pagination: {
      el: pagination!
    },
    navigation: {
      nextEl: next!,
      prevEl: prev!
    },
    on: {
      update: swiper => {
        swiper.slideToLoop(0, 0, false)
        sdk[mode]?.enable()
      }
    }
  })
}

export function refreshSwiper(mode: SwiperMode) {
  sdk[mode]?.disable()
  sdk[mode]?.update()
}

function updateTiles(mode: SwiperMode) {
  const hiddenTiles = Array.from(sdk.placement.getAllHiddenTilesInDom())
  const hiddenTileIds = hiddenTiles.map(hidTile => hidTile.getAttribute("data-id"))

  const indexesToRemove = hiddenTileIds.map(id =>
    sdk[mode]!.slides.findIndex(slide => slide.querySelector(`div.ugc-tile[data-id="${id}"]`))
  )

  sdk[mode]?.removeSlide(indexesToRemove)
}
