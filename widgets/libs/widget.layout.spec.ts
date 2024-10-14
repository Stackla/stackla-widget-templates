import { BaseConfig } from "types/IBaseConfig"
import { isEnabled, hasMinimumTilesRequired } from "./widget.layout"

const sdk: {
  querySelector: jest.Mock
  querySelectorAll: jest.Mock
} = {
  querySelector: jest.fn(),
  querySelectorAll: jest.fn()
}
const defaultWidgetSettings: BaseConfig = {
  tiles_per_page: 10,
  enable_custom_tiles_per_page: false,
  rows_per_page: 3,
  auto_refresh: false,
  expanded_tile_show_shopspots: false,
  expanded_tile_show_products: false,
  expanded_tile_show_add_to_cart: false,
  expanded_tile_show_navigation_arrows: true
}

describe("Widget Settings Functions", () => {
  beforeEach(() => {
    // @ts-expect-error sdk is not defined in global since its exclusive to this test.
    global.sdk = sdk
  })

  describe("hasMinimumTilesRequired", () => {
    it("returns true when minimal_tiles is not set", () => {
      const widgetSettings = { ...defaultWidgetSettings, minimal_tiles: undefined }
      expect(hasMinimumTilesRequired(widgetSettings)).toBe(true)
    })

    it("returns true when minimal_tiles is set to 0", () => {
      const widgetSettings = { ...defaultWidgetSettings, minimal_tiles: 0 }
      expect(hasMinimumTilesRequired(widgetSettings)).toBe(true)
    })

    it("returns true when minimal_tiles is set and there are enough tiles", () => {
      const widgetSettings = { ...defaultWidgetSettings, minimal_tiles: 3 }
      sdk.querySelectorAll.mockReturnValue([{}, {}, {}])
      expect(hasMinimumTilesRequired(widgetSettings)).toBe(true)
    })

    it("throws error when minimum tiles is set and there are not enough tiles", () => {
      const widgetSettings = { ...defaultWidgetSettings, minimal_tiles: 3 }
      sdk.querySelectorAll.mockReturnValue([{}])

      try {
        hasMinimumTilesRequired(widgetSettings)
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(Error)
        if (error instanceof Error) {
          expect(error.message).toBe("Not enough tiles to render widget. Expected 3 but found 1")
        }
      }
    })
  })

  describe("isEnabled", () => {
    it("returns true when enabled is true and hasMinimumTilesRequired returns true", () => {
      const widgetSettings = { ...defaultWidgetSettings, enabled: true, minimal_tiles: 3 }
      sdk.querySelectorAll.mockReturnValue([{}, {}, {}])
      expect(isEnabled(widgetSettings)).toBe(true)
    })

    it("returns exception when enabled is true but hasMinimumTilesRequired returns false", () => {
      const widgetSettings = { ...defaultWidgetSettings, enabled: true, minimal_tiles: 3 }
      sdk.querySelectorAll.mockReturnValue([{}])
      try {
        isEnabled(widgetSettings)
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(Error)
        if (error instanceof Error) {
          expect(error.message).toBe("Not enough tiles to render widget. Expected 3 but found 1")
        }
      }
    })

    it("returns false when enabled is false", () => {
      const widgetSettings = { ...defaultWidgetSettings, enabled: false, minimal_tiles: 3 }
      expect(isEnabled(widgetSettings)).toBe(false)
    })
  })
})
