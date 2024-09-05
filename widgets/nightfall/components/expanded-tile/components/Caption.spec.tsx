import Caption, { isCaptionEnabled } from "./Caption"
import { Tile } from "@stackla/ugc-widgets"
import { createElement } from "jsx-html"
import tiles from "../../../../../tests/fixtures/tiles.fixtures"
import { IWidgetSettings } from "types/IWidgetSettings"

const mockSdk = {
  isComponentLoaded: jest.fn(),
  getNodeId: jest.fn(),
  placement: {
    getWidgetContainer: () => {
      return {
        widgetOptions: {
          widgetStyle: {
            expanded_tile_show_caption: false
          },
          widgetConfig: {}
        },
        enabled: true
      }
    }
  }
}

// @ts-expect-error global properties are not typed
global.sdk = mockSdk

describe("isCaptionEnabled", () => {
  it("should return true when tile has a message and show_caption is true", () => {
    const tile = { message: "Sample caption" } as Tile
    const widgetSettings = { expanded_tile_show_caption: true } as IWidgetSettings
    expect(isCaptionEnabled(tile, widgetSettings)).toBe(true)
  })

  it("should return false when tile has a message but show_caption is false", () => {
    const tile = { message: "Sample caption" } as Tile
    const widgetSettings = { expanded_tile_show_caption: false } as IWidgetSettings
    expect(isCaptionEnabled(tile, widgetSettings)).toBe(false)
  })

  it("should return false when tile does not have a message but show_caption is true", () => {
    const tile = { message: "" } as Tile
    const widgetSettings = { expanded_tile_show_caption: true } as IWidgetSettings
    expect(isCaptionEnabled(tile, widgetSettings)).toBe(false)
  })

  it("should return false when tile does not have a message and show_caption is false", () => {
    const tile = { message: "" } as Tile
    const widgetSettings = { expanded_tile_show_caption: false } as IWidgetSettings
    expect(isCaptionEnabled(tile, widgetSettings)).toBe(false)
  })
})

describe("Caption Component", () => {
  const tile = { message: "Sample caption" } as Tile
  const widgetSettings = { expanded_tile_show_caption: true } as IWidgetSettings

  beforeEach(() => {
    mockSdk.isComponentLoaded.mockReturnValue(true)
    mockSdk.getNodeId.mockReturnValue("parent-id")

    window.document.body.innerHTML = ""
  })

  it("should render vital components", () => {
    const caption = <Caption tile={tile} widgetSettings={widgetSettings} />
    expect(caption.toString()).toBe(
      `<div class="caption"><p class="caption-paragraph">Sample caption</p><div class="tile-timestamp"></div><ugc-products parent="parent-id"></ugc-products></div>`
    )
  })

  it("should not render caption when disabled", () => {
    const widgetSettings = { expanded_tile_show_caption: false } as IWidgetSettings
    const caption = <Caption tile={tile} widgetSettings={widgetSettings} />
    expect(caption.toString()).toBe(
      `<div class="caption"><p class="caption-paragraph"></p><div class="tile-timestamp"></div><ugc-products parent="parent-id"></ugc-products></div>`
    )
  })

  it("should render tags from tile", () => {
    const tile = tiles[0]
    const caption = <Caption tile={tile} widgetSettings={widgetSettings} />
    expect(caption.toString()).toContain(`<a href="#">Single column span</a>`)
    expect(caption.toString()).toContain(`<a href="#">Double column span</a>`)
  })

  it("should not render ugc-products component when products are disabled", () => {
    mockSdk.isComponentLoaded.mockReturnValue(false)
    const caption = <Caption tile={tile} widgetSettings={widgetSettings} />
    expect(caption.toString()).toBe(
      `<div class="caption"><p class="caption-paragraph">Sample caption</p><div class="tile-timestamp"></div></div>`
    )
  })
})
