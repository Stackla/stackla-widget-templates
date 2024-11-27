import { loadAllUnloadedTiles } from "@stackla/widget-utils/extensions/swiper"
import { loadWidget } from "@stackla/widget-utils"
import "./direct-uploader.component"
import { loadDirectUploaderTileButton } from "./direct-uploader.lib"
import shopspotStyle from "../styles/templates/shopspot-icon/styles.scss"
import tagsStyles from "../styles/templates/tags/tags.scss"

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
