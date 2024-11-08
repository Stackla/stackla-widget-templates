import { loadAllUnloadedTiles } from "@stackla/widget-utils/extensions/swiper"
import { loadWidget } from "@stackla/widget-utils"
import shopspotStyle from "./components/shopspot-icon/base.scss"
import { refreshWaterfallLayout, reinitialiseWaterfallLayout, resizeAllUgcTilesHeight } from "./waterfall.lib"

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
