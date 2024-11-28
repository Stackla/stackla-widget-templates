import { loadWidget } from "@stackla/widget-utils"
import { reinitialiseWaterfallLayout, loadWaterfallLayout } from "./waterfall.lib"

loadWidget({
  callbacks: {
    onLoadMore: [() => loadWaterfallLayout()],
    onTilesUpdated: [() => loadWaterfallLayout()],
    onResize: [() => reinitialiseWaterfallLayout()]
  }
})
loadWaterfallLayout()
// loadAllUnloadedTiles()
