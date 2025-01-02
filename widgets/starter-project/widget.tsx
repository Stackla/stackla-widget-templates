import { loadWidget } from "@stackla/widget-utils"
import { createToast, getMyMoodBorder } from "./starter-project.lib"
import { ExpandedTiles } from "./expanded-tile.template"
import ProductsTemplate from "./products.template"

loadWidget({
  features: {
    tileSizeSettings: {
      small: "173px",
      medium: "265.5px",
      large: "400px"
    },
    cssVariables: {
      "--my-mood-border": getMyMoodBorder("happy")
    }
  },
  callbacks: {
    onLoad: [() => createToast("Tiles loaded!")],
    onTilesUpdated: [() => createToast("Tiles updated!")],
    onResize: [() => createToast("Resized!")],
    onLoadMore: [() => createToast("More tiles loaded!")],
    onTileExpand: [() => createToast("Tile expanded!")],
    onTileClose: [() => createToast("Tile closed!")]
  },
  templates: {
    "expanded-tiles": {
      template: ExpandedTiles
    },
    "ugc-products": {
      template: ProductsTemplate
    }
  }
})
