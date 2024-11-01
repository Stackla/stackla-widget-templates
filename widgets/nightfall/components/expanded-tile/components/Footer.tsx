import { createElement } from "@stackla/widget-utils"
import { ExpandedTileProps } from "../../../types/ExpandedTileProps"

export default ({ tile }: ExpandedTileProps) => (
  <div class="footer">
    <span className={`base-v2 source source-${tile.source}`}>
      <i className={`fs fs-${tile.source}`}></i>
    </span>
  </div>
)
