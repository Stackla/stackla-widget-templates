import loadSlider from "./load-slider"
import { loadWidget } from "@stackla/widget-utils"

loadWidget({
  extensions: {},
  features: {
    handleLoadMore: false,
    addNewTilesAutomatically: true
  },
  callbacks: {
    onLoad: [loadSlider]
  },
  templates: {}
})
