import { Tile } from "@stackla/ugc-widgets"

export function getTagsFromTile(tile: Tile) {
  if (!tile.tags_extended) {
    return ""
  }

  return `<div class='tags'>${tile.tags_extended.map(tag => `<div class='tag'><span><a href="${tag.custom_url ?? "#"}">${tag.tag}</a></span></div>`).join("")}</div>`
}