import { loadWidget, ISdk } from "@stackla/widget-utils"
import { loadWaterfallLayout } from "./waterfall.lib"

declare const sdk: ISdk
loadWidget(sdk, {
  callbacks: {
    onLoadMore: [() => loadWaterfallLayout(false)]
  },
  templates: {},
  features: {
    addNewTilesAutomatically: false,
    cssVariables: {
      "--tile-share-content-display-inline":
        sdk.getInlineTileConfig().show_sharing || sdk.getInlineTileConfig().show_timestamp ? "flex" : "none"
    }
  }
})

void loadWaterfallLayout(false)
