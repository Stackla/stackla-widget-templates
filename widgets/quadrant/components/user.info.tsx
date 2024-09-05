import type { Tile } from "@stackla/ugc-widgets"
import { createElement } from "jsx-html"

export const UserInfo = ({ tile }: { tile: Tile }) => {
  return (
    <div className="user-info-wrapper">
      <div className="user-info">
        {tile.avatar && (
          <span className="avatar-wrapper">
            <a className="avatar-link" href={tile.original_url} target="_blank" rel="noopener noreferrer">
              <img src={tile.avatar} alt="User Avatar" />
            </a>
          </span>
        )}
        {tile.user && (
          <a className="user-link" href={tile.original_url} target="_blank" rel="noopener noreferrer">
            <div className="user-top">
              <span className="user-name">{tile.user}</span>
            </div>
            <div className="user-bottom">
              <span className="user-handle">@{tile.user}</span>
            </div>
          </a>
        )}
      </div>
    </div>
  )
}
