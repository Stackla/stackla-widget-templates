import { loadWidget } from "@stackla/widget-utils"
import { loadWaterfallLayout } from "./waterfall.lib"

loadWidget({
  callbacks: {
    onLoadMore: [() => loadWaterfallLayout()],
    onTilesUpdated: [() => loadWaterfallLayout()],
    onResize: [() => loadWaterfallLayout()]
  },
  templates: {},
  features: {},
  extensions: {}
})
loadWaterfallLayout()
