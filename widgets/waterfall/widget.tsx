import { loadAllUnloadedTiles } from "@stackla/widget-utils/extensions/swiper"
import { ISdk, loadWidget } from "@stackla/widget-utils"
import { initializeSwiperForTags } from "@stackla/widget-utils/dist/libs/templates/tags/tags-swiper.loader"
import shopspotStyle from "./components/shopspot-icon/base.scss"
import { refreshWaterfallLayout, reinitialiseWaterfallLayout, resizeAllUgcTilesHeight } from "./waterfall.lib"

declare const sdk: ISdk

const settings = {
  extensions: {},
  features: {},
  callbacks: {
    onMoreLoad: [() => refreshWaterfallLayout()],
    onTilesUpdated: [() => refreshWaterfallLayout()],
    resize: [() => reinitialiseWaterfallLayout()]
  },
  templates: {
    "expanded-tiles": {
      style: {
        css: shopspotStyle,
        global: true
      }
    }
  }
}

loadWidget(settings)
resizeAllUgcTilesHeight()
loadAllUnloadedTiles()

const tiles = Array.from(sdk.querySelectorAll<HTMLElement>(".grid-item") ?? [])
tiles.forEach(async (tile: HTMLElement) => {
  const tileId = tile.getAttribute("data-id")
  if (tileId) {
    initializeSwiperForTags(tileId, tile)
  }
})
