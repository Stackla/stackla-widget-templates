import { loadSlider } from "./load-slider"
import { loadWidget } from "@stackla/widget-utils"
import { initObservers } from "./observers"

// dimensions from Figma design
const tileSizeSettings = {
  small: "148.34px",
  medium: "225px",
  large: "435px"
}

let sliderCallbacks: ReturnType<typeof loadSlider>

const observers = initObservers({
  settings: tileSizeSettings,
  resizeCb: () => {
    observers?.configTileIntersectionTargets()
  }
})

observers?.configTileIntersectionTargets()

loadWidget({
  features: {
    handleLoadMore: false,
    addNewTilesAutomatically: false,
    tileSizeSettings
  },
  callbacks: {
    onLoad: [
      () =>
        void setTimeout(() => {
          observers?.configResizeObserverTargets()
          sliderCallbacks = loadSlider(tileSizeSettings, observers)
        }, 1000)
    ],
    onResize: [
      () => {
        sliderCallbacks.resizeHandler()
      }
    ],
    onTilesUpdated: [() => sliderCallbacks?.tilesUpdatedEventHandler()],
    onTileBgImageError: [() => sliderCallbacks?.tilesUpdatedEventHandler()]
  }
})
