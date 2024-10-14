import { BaseConfig } from "types/IBaseConfig"

export default function getCSSVariables<T extends BaseConfig>(widgetSettings: T): string {
  const tileSizes: { [key: string]: string } = {
    small: "127.8px",
    medium: "210.4px",
    large: "265.5px"
  }
  const cssVariables: { [key: string]: string } = {
    "--widget-background": `#${widgetSettings.widget_background}`,
    "--text-tile-background": `#${widgetSettings.text_tile_background}`,
    "--text-tile-font-color": `#${widgetSettings.text_tile_font_color}`,
    "--text-tile-link-color": `#${widgetSettings.text_tile_link_color}`,
    "--text-tile-user-name-font-color": `#${widgetSettings.text_tile_user_name_font_color}`,
    "--text-tile-user-handle-font-color": `#${widgetSettings.text_tile_user_handle_font_color}`,
    "--text-tile-tag-font-color": `#${widgetSettings.text_tile_tag_font_color}`,
    "--shopspot-btn-background": `#${widgetSettings.shopspot_btn_background}`,
    "--shopspot-btn-font-color": `#${widgetSettings.shopspot_btn_font_color}`,
    "--max-tile-width": `${widgetSettings.max_tile_width}px`,
    "--margin": `${widgetSettings.margin ? widgetSettings.margin : 0}px`,
    "--text-tile-font-size": `${widgetSettings.text_tile_font_size}px`,
    "--text-tile-user-name-font-size": `${widgetSettings.text_tile_user_name_font_size}px`,
    "--text-tile-user-handle-font-size": `${widgetSettings.text_tile_user_handle_font_size ? widgetSettings.text_tile_user_handle_font_size : 12}px`,
    "--show-caption": `${widgetSettings.show_caption ? "block" : "none"}`,
    "--tile-timephrase-display": `${widgetSettings.inline_tile_show_timestamps ? "inline-block" : "none"}`,
    "--shopspot-icon": widgetSettings.shopspot_icon
      ? `url("${widgetSettings.shopspot_icon}")`
      : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath d='M345 39.1L472.8 168.4c52.4 53 52.4 138.2 0 191.2L360.8 472.9c-9.3 9.4-24.5 9.5-33.9 .2s-9.5-24.5-.2-33.9L438.6 325.9c33.9-34.3 33.9-89.4 0-123.7L310.9 72.9c-9.3-9.4-9.2-24.6 .2-33.9s24.6-9.2 33.9 .2zM0 229.5V80C0 53.5 21.5 32 48 32H197.5c17 0 33.3 6.7 45.3 18.7l168 168c25 25 25 65.5 0 90.5L277.3 442.7c-25 25-65.5 25-90.5 0l-168-168C6.7 262.7 0 246.5 0 229.5zM144 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z' fill='%23fff' /%3E%3C/svg%3E")`,
    "--tags-gap": `${widgetSettings.tags_gap ? widgetSettings.tags_gap : 4}px`,
    "--tile-tag-background": `#${widgetSettings.tile_tag_background}`,
    "--cta-button-background-color": `#${widgetSettings.cta_button_background_color}`,
    "--cta-button-font-color": `#${widgetSettings.cta_button_font_color}`,
    "--cta-button-font-size": `${widgetSettings.cta_button_font_size}px`,
    "--expanded-tile-border-radius": `${widgetSettings.expanded_tile_border_radius}px`,
    "--tile-size": `${tileSizes["medium"]}` // Set default to medium until tile_size is available
  }

  return Object.entries(cssVariables)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n")
}
