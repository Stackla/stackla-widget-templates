import type { Tile } from "@stackla/ugc-widgets"
import { createElement } from "jsx-html"

export const ImageWrapper = ({
  tile,
  shopspotEnabled,
  parent
}: {
  tile: Tile
  shopspotEnabled: boolean
  parent: string
}) => {
  return (
    <div className="image-wrapper">
      <div className="image-wrapper-inner">
        <div className="image">
          {shopspotEnabled ? <shopspot-flyout parent={parent}></shopspot-flyout> : null}
          {shopspotEnabled ? <shopspot-icon parent={parent} /> : null}
          {tile.image ? <img className="image-element" src={tile.image} /> : null}
        </div>
      </div>
    </div>
  )
}
