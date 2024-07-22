export interface BaseConfig {
  enabled?: boolean;
  tiles_per_page: number;
  enable_custom_tiles_per_page: boolean;
  rows_per_page: number;
  click_through_url?: string;
  auto_refresh: boolean;
  expanded_tile_show_shopspots: boolean;
  expanded_tile_show_products: boolean;
  expanded_tile_show_add_to_cart: boolean;
  load_more_type?: string;
  widget_background?: string;
  text_tile_background?: string;
  text_tile_font_color?: string;
  text_tile_link_color?: string;
  text_tile_user_name_font_color?: string;
  text_tile_user_handle_font_color?: string;
  shopspot_btn_background?: string;
  shopspot_btn_font_color?: string;
  max_tile_width?: number;
  margin?: number;
  text_tile_font_size?: number;
  text_tile_user_name_font_size?: number;
  text_tile_user_handle_font_size?: number;
  show_caption?: boolean;
  shopspot_icon?: string;
  show_inline_tags?: boolean;
}
