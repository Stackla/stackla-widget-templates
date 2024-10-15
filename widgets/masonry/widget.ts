import { loadAllUnloadedTiles } from "@widgets/libs/extensions/swiper/loader.extension"
import { loadWidgetSettings } from "./widget.settings"
import { loadCustomisation } from "./widget.templates"
import { resizeAllUgcTiles } from "./masonry.lib"

loadCustomisation()
loadWidgetSettings()
loadAllUnloadedTiles()
resizeAllUgcTiles()
