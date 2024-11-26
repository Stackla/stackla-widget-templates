import loadSlider from "./load-slider"
import { loadWidget } from "@stackla/widget-utils"
import userContentStyles from "./components/tile-content/overrides.scss"
import shopspotStyle from "./components/shopspot-icon/base.scss"

loadWidget({
  type: "slider",
  extensions: {},
  features: {
    handleLoadMore: false,
    addNewTilesAutomatically: true
  },
  callbacks: {
    onLoad: [loadSlider]
  },
  templates: {
    "tile-content": {
      styles: [
        {
          css: userContentStyles,
          global: false
        }
      ]
    },
    "expanded-tiles": {
      styles: [
        {
          css: shopspotStyle,
          global: true
        }
      ]
    }
  }
})
