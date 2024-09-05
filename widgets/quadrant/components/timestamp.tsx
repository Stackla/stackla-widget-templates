import type { Tile } from "@stackla/ugc-widgets"
import { IWidgetSettings } from "types/IWidgetSettings"
import { getTimephrase } from "../../libs/tile.lib"
import { createElement } from "jsx-html"

export const Timestamp = ({ tile, widgetSettings }: { tile: Tile; widgetSettings: IWidgetSettings }) => {
  return (
    <div className="tile-timestamp">
      {tile.source_created_at && widgetSettings.expanded_tile_show_timestamp
        ? getTimephrase(tile.source_created_at)
        : ""}
    </div>
  )
}
