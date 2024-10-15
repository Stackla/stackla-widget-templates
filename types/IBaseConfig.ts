export interface BaseConfig {
  enabled?: boolean
  tiles_per_page: number
  enable_custom_tiles_per_page: boolean
  rows_per_page: number
  click_through_url?: string
  auto_refresh: boolean
  expanded_tile_show_shopspots: boolean
  expanded_tile_show_products: boolean
  expanded_tile_show_add_to_cart: boolean
  expanded_tile_show_navigation_arrows?: boolean
  expanded_tile_border_radius?: number
  load_more_type?: "static" | "scroll" | "button"
  widget_background?: string
  text_tile_background?: string
  text_tile_font_color?: string
  text_tile_link_color?: string
  text_tile_user_name_font_color?: string
  text_tile_user_handle_font_color?: string
  text_tile_tag_font_color?: string
  shopspot_btn_background?: string
  shopspot_btn_font_color?: string
  max_tile_width?: number
  margin?: number
  text_tile_font_size?: number
  text_tile_user_name_font_size?: number
  text_tile_user_handle_font_size?: number
  tags_gap?: number
  show_caption?: boolean
  shopspot_icon?: string
  show_inline_tags?: boolean
  minimal_tiles?: number
  inline_tile_show_timestamps?: boolean
  tile_tag_background?: string
  cta_button_background_color?: string
  cta_button_font_color?: string
  cta_button_font_size?: number
}
