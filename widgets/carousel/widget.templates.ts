import { loadExpandedTileTemplates } from "./components/expanded-tile"
import { loadProductsTemplate } from "./components/products"
import { loadShopspotTemplates } from "./components/shopspot-icon"
import { loadSwiperStyles } from "@libs/extensions/swiper"
import icons from "../../uikit/icon.scss"
import { Sdk } from "@stackla/ugc-widgets"

declare const sdk: Sdk

export function loadCustomisation() {
  loadProductsTemplate()
  loadExpandedTileTemplates()
  loadShopspotTemplates()
  loadSwiperStyles()
  sdk.addSharedCssCustomStyles(icons)
}