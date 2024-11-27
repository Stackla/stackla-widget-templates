import { loadAllUnloadedTiles } from "@stackla/widget-utils/extensions/swiper"
import { loadWidget } from "@stackla/widget-utils"
import productsStyle from "./components/products/base.scss"

loadWidget({
  extensions: {},
  features: {
    preloadImages: false,
    hideBrokenImages: true
  },
  callbacks: {},
  templates: {
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
