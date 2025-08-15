import { loadWidget, Sdk } from "@stackla/widget-utils"
import { loadWaterfallLayout } from "../waterfall/waterfall.lib"
import ProductsTemplate from "./products.template"

declare const sdk: Sdk

loadWidget(sdk, {
  callbacks: {
    onLoadMore: [() => loadWaterfallLayout(false)]
  },
  templates: {
    "ugc-products": ProductsTemplate
  },
  features: {
    cssVariables: {
      "--tile-share-content-display-inline":
        sdk.getInlineTileConfig().show_sharing || sdk.getInlineTileConfig().show_timestamp ? "flex" : "none"
    }
  }
})

void loadWaterfallLayout(false)
