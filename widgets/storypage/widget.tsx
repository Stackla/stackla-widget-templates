import { loadAllUnloadedTiles } from "@stackla/widget-utils/extensions/swiper"
import { loadWidget } from "@stackla/widget-utils"

import "./direct-uploader.component"
import { loadDirectUploaderTileButton } from "./direct-uploader.lib"

loadWidget({
  extensions: {},
  features: {
    handleLoadMore: false
  },
  callbacks: {
    onLoad: [
      () => {
        loadDirectUploaderTileButton()
      }
    ],
    onTilesUpdated: [
      () => {
        loadDirectUploaderTileButton()
      }
    ]
  },
  templates: {}
})

loadAllUnloadedTiles()
