import { Tile } from "@stackla/public-types"
import { createElement, createFragment } from "jsx-html"

type TagsProps = {
  tile: Tile
}

export function Tags({ tile }: TagsProps) {
  return tile.tags_extended ? (
    <div class="tile-tags">
      {tile.tags_extended.map(tag => (
        <div class="tile-tag">
          <a href={tag.custom_url ?? "#"}>{tag.tag}</a>
        </div>
      ))}
    </div>
  ) : (
    <></>
  )
}
