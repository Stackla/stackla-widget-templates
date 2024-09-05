import type { Tile } from "@stackla/ugc-widgets"
import { createElement } from "jsx-html"
import { ImageWrapper } from "./image.wrapper"

export const PanelLeft = ({
  tile,
  shopspotEnabled,
  parent
}: {
  tile: Tile
  shopspotEnabled: boolean
  parent: string
}) => {
  return (
    <div className="panel-left">
      <ImageWrapper tile={tile} shopspotEnabled={shopspotEnabled} parent={parent} />
      <div>
        <span className="source">
          <i className={`fs fs-${tile.source}`}></i>
        </span>
      </div>
    </div>
  )
}
