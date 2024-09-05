import type { Tile } from "@stackla/ugc-widgets"
import { IWidgetSettings } from "types/IWidgetSettings"
import { createElement } from "jsx-html"
import { SharingButtons } from "./share.buttons"

export const Caption = ({ tile, widgetSettings }: { tile: Tile; widgetSettings: IWidgetSettings }) => {
  return (
    <div className="caption">
      <p className="caption-paragraph">
        {tile.message && widgetSettings.expanded_tile_show_caption ? tile.message : ""}
      </p>
      {widgetSettings.expanded_tile_show_sharing ? <SharingButtons tile={tile} /> : null}
    </div>
  )
}
