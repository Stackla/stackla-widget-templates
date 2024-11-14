import { loadAllUnloadedTiles } from "@stackla/widget-utils/extensions/swiper"
import { loadWidget } from "@stackla/widget-utils"
import shopspotStyle from "./components/shopspot-icon/base.scss"
import productsStyle from "./components/products/base.scss"

loadWidget({
  extensions: {},
  features: {
    preloadImages: false,
    hideBrokenImages: true
  },
  callbacks: {},
  templates: {
    "expanded-tiles": {
      styles: [
        {
          css: shopspotStyle,
          global: true
        }
      ]
    },
    "ugc-products": {
      styles: [
        {
          css: productsStyle,
          global: false
        }
      ]
    }
  }
})
loadAllUnloadedTiles()
