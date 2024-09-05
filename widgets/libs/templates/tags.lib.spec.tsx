import tiles from "../../../tests/fixtures/tiles.fixtures"
import { Tags } from "./tags.lib"
import { createElement } from "jsx-html"

describe("widgets/nightfall/components/expanded-tile/base.template.ts", () => {
  it("should return empty string if tile does not have extended tags", () => {
    expect(<Tags tile={tiles[7]} />).toEqual(<div className="tags"></div>)
  })

  it("should return tags if tile has extended tags", () => {
    const tile = tiles[0]

    expect(tile.tags_extended).toBeDefined()

    const expected = (
      <div class="tags">
        {tile.tags_extended!.map(tag => (
          <div class="tag">
            <a href={tag.custom_url ?? "#"}>{tag.tag}</a>
          </div>
        ))}
      </div>
    )

    expect(<Tags tile={tile} />).toEqual(expected)
  })
})
