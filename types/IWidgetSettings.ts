import { BaseConfig } from "./IBaseConfig"

export interface IWidgetSettings extends BaseConfig {
  expanded_tile_show_shopspots: boolean
  expanded_tile_show_products: boolean
  expanded_tile_show_add_to_cart: boolean
  expanded_tile_border_radius?: number
  enable_custom_tiles_per_page: boolean
  tiles_per_page: number
  enabled: boolean
  name: string
  minimal_tiles: number
  auto_refresh: boolean
  unavailable_products_behaviour: string
  rows_per_page: number
  widget_background?: string
  text_tile_background?: string
  text_tile_font_size?: number
  text_tile_font_color?: string
  text_tile_link_color?: string
  text_tile_user_name_font_size?: number
  text_tile_user_name_font_color?: string
  text_tile_user_handle_font_size?: number
  text_tile_user_handle_font_color?: string
  tags_gap?: number
  enable_typekit?: boolean
  max_tile_width?: number
  margin?: number
  load_more_type?: string
  show_claim_button?: boolean
  enable_doublecolumnspan?: boolean
  shopspot_btn_background?: string
  shopspot_btn_font_color?: string
  shopspot_icon?: string
  show_caption: boolean
  inline_tile_show_shopspots: boolean
  expanded_tile_show_sharing: boolean
  expanded_tile_show_caption: boolean
  expanded_tile_show_timestamp: boolean
  expanded_tile_show_tags?: boolean
  expanded_tile_show_navigation_arrows?: boolean
}
