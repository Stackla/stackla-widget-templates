import type { WidgetContainer } from "@stackla/ugc-widgets"
import { IWidgetSettings } from "types/IWidgetSettings"

export function getConfig(widgetContainer: WidgetContainer): IWidgetSettings {
  const { enabled, widgetOptions } = widgetContainer

  if (!enabled) {
    throw new Error("Widget is not enabled")
  }

  const { widgetStyle, widgetConfig } = widgetOptions

  if (!widgetStyle) {
    throw new Error("Failed to find widgetStyle")
  }

  if (!widgetConfig) {
    throw new Error("Failed to find widgetConfig")
  }

  if (!widgetConfig.lightbox) {
    throw new Error("Failed to find lightbox")
  }

  if (!widgetConfig.tile_options) {
    throw new Error("Failed to find tile_options")
  }

  const widgetSettings = {
    enabled: enabled,
    name: widgetStyle.name ?? "",
    minimal_tiles: widgetStyle.minimal_tiles ?? 0,
    auto_refresh: widgetStyle.auto_refresh ?? false,
    unavailable_products_behaviour: widgetStyle.unavailable_products_behaviour ?? "",
    enable_custom_tiles_per_page: widgetStyle.enable_custom_tiles_per_page ?? false,
    rows_per_page: widgetStyle.rows_per_page ?? 1,
    tiles_per_page: widgetStyle.tiles_per_page ?? 4,
    widget_background: widgetStyle.widget_background,
    text_tile_background: widgetStyle.text_tile_background,
    text_tile_font_size: widgetStyle.text_tile_font_size,
    text_tile_font_color: widgetStyle.text_tile_font_color,
    text_tile_link_color: widgetStyle.text_tile_link_color,
    text_tile_user_name_font_size: widgetStyle.text_tile_user_name_font_size,
    text_tile_user_name_font_color: widgetStyle.text_tile_user_name_font_color,
    text_tile_user_handle_font_size: widgetStyle.text_tile_user_handle_font_size,
    text_tile_user_handle_font_color: widgetStyle.text_tile_user_handle_font_color,
    max_tile_width: widgetStyle.max_tile_width,
    margin: widgetStyle.margin,
    click_through_url: widgetStyle.click_through_url ?? "",
    load_more_type: widgetStyle.load_more_type,
    show_claim_button: widgetConfig?.claim_config?.show_claim_button,
    enable_doublecolumnspan: widgetStyle.enable_doublecolumnspan,
    shopspot_btn_background: widgetStyle.shopspot_btn_background,
    shopspot_btn_font_color: widgetStyle.shopspot_btn_font_color,
    shopspot_icon: widgetStyle.shopspot_icon,
    show_caption: widgetConfig.tile_options.show_caption ?? true,
    inline_tile_show_shopspots: widgetConfig.tile_options.show_shopspots ?? false,
    expanded_tile_show_sharing: widgetConfig.lightbox.show_sharing ?? false,
    expanded_tile_show_products: widgetConfig.lightbox.show_products ?? true,
    expanded_tile_show_caption: widgetConfig.lightbox.show_caption ?? true,
    expanded_tile_show_shopspots: widgetConfig.lightbox.show_shopspots ?? false,
    expanded_tile_show_timestamp: widgetConfig.lightbox.show_timestamp ?? true,
    expanded_tile_show_add_to_cart: widgetConfig.lightbox.show_add_to_cart ?? false
  }

  return widgetSettings
}
