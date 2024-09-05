import { Tile } from "@stackla/ugc-widgets"
import { createElement, createFragment } from "jsx-html"

type TagsProps = {
  tile: Tile
}

export function Tags({ tile }: TagsProps) {
  return tile.tags_extended ? (
    <div class="tags">
      {tile.tags_extended.map(tag => (
        <div class="tag">
          <a href={tag.custom_url ?? "#"}>{tag.tag}</a>
        </div>
      ))}
    </div>
  ) : (
    <></>
  )
}
