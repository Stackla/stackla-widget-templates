import loadSlider from "./load-slider"
import { loadWidget } from "@stackla/widget-utils"

loadWidget({
  features: {
    handleLoadMore: false,
    addNewTilesAutomatically: true
  },
  callbacks: {
    onLoad: [loadSlider]
  }
})
