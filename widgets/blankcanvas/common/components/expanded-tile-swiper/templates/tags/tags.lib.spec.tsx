import { createElement } from "@stackla/widget-utils"
import tiles from "../../../../../../../tests/fixtures/tiles"
import { Tags } from "./tags.lib"

describe("widgets/nightfall/components/expanded-tile/base.template.ts", () => {
  it("should return empty string if tile does not have extended tags", () => {
    const rendered = <Tags tile={tiles[7]} />
    const expected = <div className="tags"></div>
    expect(rendered.innerHTML).toEqual(expected.innerHTML)
  })

  it("should return tags if tile has extended tags", () => {
    const tile = tiles[0]

    expect(tile.tags_extended).toBeDefined()

    const rendered = <Tags tile={tile} />
    const expected = (
      <div class="tile-tags">
        {tile.tags_extended!.map(tag => (
          <div class="tile-tag">
            <a href={tag.custom_url ?? "#"}>{tag.tag}</a>
          </div>
        ))}
      </div>
    )

    expect(rendered.innerHTML).toEqual(expected.innerHTML)
  })
})
