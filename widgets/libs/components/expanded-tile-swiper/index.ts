import { ExpandedTiles } from "./base.template"
import expandedTileStyle from "./base.scss"
import swiperExpandedStyles from "@libs/extensions/swiper/swiper-expanded-tile.scss"
import tileTagStyles from "@libs/templates/tags/tags.scss"
import { Sdk } from "@stackla/ugc-widgets"
import shareMenuStyle from "@libs/templates/share-menu/share-menu.scss"
import addToCartStyleOverrides from "./add-to-cart.scss"

declare const sdk: Sdk

export function loadExpandedTileTemplates() {
  sdk.addCSSToComponent(expandedTileStyle, "expanded-tiles")
  sdk.addCSSToComponent(shareMenuStyle, "expanded-tiles")
  sdk.addCSSToComponent(swiperExpandedStyles, "expanded-tiles")
  sdk.addCSSToComponent(tileTagStyles, "expanded-tiles")
  sdk.addTemplateToComponent(ExpandedTiles, "expanded-tiles")
  sdk.addCSSToComponent(addToCartStyleOverrides, "add-to-cart")
  sdk.addWidgetCustomStyles(` 
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  body {
    font-family: 'Inter', sans-serif;
  }`)
}
