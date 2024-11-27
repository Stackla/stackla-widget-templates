import { loadAllUnloadedTiles } from "@stackla/widget-utils/extensions/swiper"
import { loadWidget } from "@stackla/widget-utils"
import { ExpandedTiles } from "./common/components/expanded-tile-swiper/base.template"
import expandedTileStyle from "./common/styles/components/expanded-tile-swiper/base.scss"
import swiperExpandedStyles from "./common/styles/components/expanded-tile-swiper/swiper-expanded.scss"
import tileTagStyles from "../styles/templates/tags/tags.scss"
import shareMenuStyle from "../styles/templates/share-menu/share-menu.scss"
import shopspotStyle from "../styles/templates/shopspot-icon/styles.scss"

loadWidget({
  extensions: {},
  features: {
    expandedTileSettings: {
      useDefaultExpandedTileStyles: false,
      useDefaultProductStyles: false,
      useDefaultAddToCartStyles: false,
      useDefaultExpandedTileTemplates: false,
      defaultFont:
        "https://fonts.googleapis.com/css2?family=Doto:wght@100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
      useDefaultSwiperStyles: true
    }
  },
  callbacks: {},
  templates: {
    "expanded-tiles": {
      styles: [
        {
          css: shopspotStyle,
          global: true
        },
        {
          css: expandedTileStyle,
          global: false
        },
        {
          css: swiperExpandedStyles,
          global: false
        },
        {
          css: tileTagStyles,
          global: false
        },
        {
          css: shareMenuStyle,
          global: false
        }
      ],
      template: ExpandedTiles
    }
  }
})
loadAllUnloadedTiles()
