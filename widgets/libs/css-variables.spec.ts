import { BaseConfig } from "types/IBaseConfig";
import getCSSVariables from "../libs/css-variables";

describe("getCSSVariables", () => {
  it("should return CSS variables string with provided settings", () => {
    const widgetSettings: BaseConfig = {
      widget_background: "ffffff",
      text_tile_background: "f0f0f0",
      text_tile_font_color: "333333",
      text_tile_link_color: "007acc",
      text_tile_user_name_font_color: "444444",
      text_tile_user_handle_font_color: "555555",
      shopspot_btn_background: "ff9900",
      shopspot_btn_font_color: "000000",
      max_tile_width: 500,
      margin: 10,
      text_tile_font_size: 14,
      text_tile_user_name_font_size: 16,
      text_tile_user_handle_font_size: 12,
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
    };

    const expectedCSS = `
          --widget-background: #ffffff;
          --text-tile-background: #f0f0f0;
          --text-tile-font-color: #333333;
          --text-tile-link-color: #007acc;
          --text-tile-user-name-font-color: #444444;
          --text-tile-user-handle-font-color: #555555;
          --shopspot-btn-background: #ff9900;
          --shopspot-btn-font-color: #000000;
          --max-tile-width: 500px;
          --margin: 10px;
          --text-tile-font-size: 14px;
          --text-tile-user-name-font-size: 16px;
          --text-tile-user-handle-font-size: 12px;
          --show-caption: block;
          --shopspot-icon: url("http://example.com/icon.png");
      `;

    expect(getCSSVariables(widgetSettings).replace(/\s/g, "")).toBe(
      expectedCSS.replace(/\s/g, ""),
    );
  });

  it("should return CSS variables string with default margin and show_caption as none", () => {
    const widgetSettings: BaseConfig = {
      widget_background: "ffffff",
      text_tile_background: "f0f0f0",
      text_tile_font_color: "333333",
      text_tile_link_color: "007acc",
      text_tile_user_name_font_color: "444444",
      text_tile_user_handle_font_color: "555555",
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
    };

    const expectedCSS = `
          --widget-background: #ffffff;
          --text-tile-background: #f0f0f0;
          --text-tile-font-color: #333333;
          --text-tile-link-color: #007acc;
          --text-tile-user-name-font-color: #444444;
          --text-tile-user-handle-font-color: #555555;
          --shopspot-btn-background: #ff9900;
          --shopspot-btn-font-color: #000000;
          --max-tile-width: 500px;
          --margin: 0px;
          --text-tile-font-size: 14px;
          --text-tile-user-name-font-size: 16px;
          --text-tile-user-handle-font-size: 12px;
          --show-caption: none;
          --shopspot-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath d='M345 39.1L472.8 168.4c52.4 53 52.4 138.2 0 191.2L360.8 472.9c-9.3 9.4-24.5 9.5-33.9 .2s-9.5-24.5-.2-33.9L438.6 325.9c33.9-34.3 33.9-89.4 0-123.7L310.9 72.9c-9.3-9.4-9.2-24.6 .2-33.9s24.6-9.2 33.9 .2zM0 229.5V80C0 53.5 21.5 32 48 32H197.5c17 0 33.3 6.7 45.3 18.7l168 168c25 25 25 65.5 0 90.5L277.3 442.7c-25 25-65.5 25-90.5 0l-168-168C6.7 262.7 0 246.5 0 229.5zM144 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z' fill='%23fff' /%3E%3C/svg%3E");
      `;

    expect(getCSSVariables(widgetSettings).replace(/\s/g, "")).toBe(
      expectedCSS.replace(/\s/g, ""),
    );
  });
});