import { loadAllUnloadedTiles } from "@stackla/widget-utils/extensions/swiper"
import { loadWidget } from "@stackla/widget-utils"
import { getQuadrantTiles } from "./quadrant.lib"

loadWidget({
  features: {
    preloadImages: false,
    hideBrokenImages: true
  }
})

loadAllUnloadedTiles()
getQuadrantTiles()
