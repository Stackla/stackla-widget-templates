import { BaseConfig } from "types/IBaseConfig"
import getCSSVariables from "../libs/css-variables"

describe("getCSSVariables", () => {
  it("should return CSS variables string with provided settings", () => {
    const widgetSettings: BaseConfig = {
      widget_background: "ffffff",
      text_tile_background: "f0f0f0",
      text_tile_font_color: "333333",
      text_tile_link_color: "007acc",
      text_tile_user_name_font_color: "444444",
      text_tile_user_handle_font_color: "555555",
      text_tile_tag_font_color: "201C1F",
      shopspot_btn_background: "ff9900",
      shopspot_btn_font_color: "000000",
      max_tile_width: 500,
      margin: 10,
      text_tile_font_size: 14,
      text_tile_user_name_font_size: 16,
      text_tile_user_handle_font_size: 12,
      tags_gap: 4,
      show_caption: true,
      shopspot_icon: "http://example.com/icon.png",
      tiles_per_page: 4,
      enable_custom_tiles_per_page: false,
      rows_per_page: 1,
      click_through_url: undefined,
      auto_refresh: true,
      expanded_tile_show_add_to_cart: false,
      expanded_tile_show_products: false,
      expanded_tile_show_shopspots: false,
      expanded_tile_show_navigation_arrows: true,
      inline_tile_show_timestamps: false,
      tile_tag_background: "D6D4D5",
      cta_button_background_color: "000000",
      cta_button_font_color: "ffffff",
      cta_button_font_size: 14,
      expanded_tile_border_radius: 5
    }

    const expectedCSS = `
    --widget-background:#ffffff;
    --text-tile-background:#f0f0f0;
    --text-tile-font-color:#333333;
    --text-tile-link-color:#007acc;
    --text-tile-user-name-font-color:#444444;
    --text-tile-user-handle-font-color:#555555;
    --text-tile-tag-font-color:#201C1F;
    --shopspot-btn-background:#ff9900;
    --shopspot-btn-font-color:#000000;
    --max-tile-width:500px;
    --margin:10px;
    --text-tile-font-size:14px;
    --text-tile-user-name-font-size:16px;
    --text-tile-user-handle-font-size:12px;
    --show-caption:block;
    --tile-timephrase-display:none;
    --shopspot-icon:url("http://example.com/icon.png");
    --tags-gap:4px;
    --tile-tag-background:#D6D4D5;
    --cta-button-background-color:#000000;
    --cta-button-font-color:#ffffff;
    --cta-button-font-size:14px;
    --expanded-tile-border-radius:5px;
      `

    expect(getCSSVariables(widgetSettings).replace(/\s/g, "")).toBe(expectedCSS.replace(/\s/g, ""))
  })

  it("should return CSS variables string with default margin and show_caption as none", () => {
    const widgetSettings: BaseConfig = {
      widget_background: "ffffff",
      text_tile_background: "f0f0f0",
      text_tile_font_color: "333333",
      text_tile_link_color: "007acc",
      text_tile_user_name_font_color: "444444",
      text_tile_user_handle_font_color: "555555",
      text_tile_tag_font_color: "201C1F",
      shopspot_btn_background: "ff9900",
      shopspot_btn_font_color: "000000",
      max_tile_width: 500,
      text_tile_font_size: 14,
      text_tile_user_name_font_size: 16,
      tiles_per_page: 4,
      enable_custom_tiles_per_page: false,
      rows_per_page: 1,
      click_through_url: undefined,
      auto_refresh: true,
      expanded_tile_show_add_to_cart: false,
      expanded_tile_show_products: false,
      expanded_tile_show_shopspots: false,
      expanded_tile_show_navigation_arrows: true,
      inline_tile_show_timestamps: true,
      tile_tag_background: "D6D4D5",
      cta_button_background_color: "000000",
      cta_button_font_color: "ffffff",
      cta_button_font_size: 14,
      expanded_tile_border_radius: 5
    }

    const expectedCSS = `
    --widget-background:#ffffff;
    --text-tile-background:#f0f0f0;
    --text-tile-font-color:#333333;
    --text-tile-link-color:#007acc;
    --text-tile-user-name-font-color:#444444;
    --text-tile-user-handle-font-color:#555555;
    --text-tile-tag-font-color:#201C1F;
    --shopspot-btn-background:#ff9900;
    --shopspot-btn-font-color:#000000;
    --max-tile-width:500px;
    --margin:0px;
    --text-tile-font-size:14px;
    --text-tile-user-name-font-size:16px;
    --text-tile-user-handle-font-size:12px;
    --show-caption:none;
    --tile-timephrase-display:inline-block;
    --shopspot-icon:url("data:image/svg+xml,%3Csvgxmlns='http://www.w3.org/2000/svg'viewBox='00512512'%3E%3Cpathd='M34539.1L472.8168.4c52.45352.4138.20191.2L360.8472.9c-9.39.4-24.59.5-33.9.2s-9.5-24.5-.2-33.9L438.6325.9c33.9-34.333.9-89.40-123.7L310.972.9c-9.3-9.4-9.2-24.6.2-33.9s24.6-9.233.9.2zM0229.5V80C053.521.5324832H197.5c17033.36.745.318.7l168168c25252565.5090.5L277.3442.7c-2525-65.525-90.50l-168-168C6.7262.70246.50229.5zM144144a3232010-6403232010640z'fill='%23fff'/%3E%3C/svg%3E");
    --tags-gap:4px;
    --tile-tag-background:#D6D4D5;
    --cta-button-background-color:#000000;
    --cta-button-font-color:#ffffff;
    --cta-button-font-size:14px;
    --expanded-tile-border-radius:5px;
      `

    expect(getCSSVariables(widgetSettings).replace(/\s/g, "")).toBe(expectedCSS.replace(/\s/g, ""))
  })
})
