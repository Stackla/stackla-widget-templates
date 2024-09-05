import { createElement } from "jsx-html"
export const TileArrows = () => {
  return (
    <div className="tile-arrows">
      <button className="tile-arrows-btn tile-arrows-left">
        <span className="widget-icon chevron-left"></span>
      </button>
      <button className="tile-arrows-btn tile-arrows-right">
        <span className="widget-icon chevron-right"></span>
      </button>
    </div>
  )
}
