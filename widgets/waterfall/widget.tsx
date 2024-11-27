import { loadWidget } from "@stackla/widget-utils"
import shopspotStyle from "./components/shopspot-icon/base.scss"
import { loadWaterfallLayout } from "./waterfall.lib"

loadWidget({
  extensions: {},
  features: {},
  callbacks: {
    onTilesUpdated: [
      () => {
        loadWaterfallLayout()
      }
    ]
  },
  templates: {
    "expanded-tiles": {
      styles: [
        {
          css: shopspotStyle,
          global: true
        }
      ]
    }
  }
})
loadWaterfallLayout()
// loadAllUnloadedTiles()
