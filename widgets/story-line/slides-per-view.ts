import { Sdk } from "types"

declare const sdk: Sdk

const screenDimention = {
  mobileL: 300,
  mobileXXL: 400,
  tablet: 557,
  miniPc: 993,
  desktop: 1500,
  wideScreen: 2000
} as const

type TileSize = "small" | "medium" | "large"

type TileSizeConfig = { [k1 in TileSize]: number }

type SlidesPerView = {
  [key: number]: TileSizeConfig
}

const slidesPerViewByDimension: SlidesPerView = {
  [screenDimention["wideScreen"]]: {
    small: 25,
    medium: 15,
    large: 12
  },
  [screenDimention["desktop"]]: {
    small: 20,
    medium: 13,
    large: 9
  },
  [screenDimention["miniPc"]]: {
    small: 12,
    medium: 7,
    large: 5
  },
  [screenDimention["tablet"]]: {
    small: 9,
    medium: 6,
    large: 4
  },
  [screenDimention["mobileXXL"]]: {
    small: 6,
    medium: 3,
    large: 2
  },
  [screenDimention["mobileL"]]: {
    small: 4,
    medium: 2,
    large: 1
  }
}

export function getSlidesPerView() {
  const {
    enable_custom_tiles_per_page: isCustomTilesPerPageEnabled,
    tiles_per_page: tilesPerPage,
    inline_tile_size: tileSize
  } = sdk.getStyleConfig()

  if (isCustomTilesPerPageEnabled) {
    return parseInt(tilesPerPage)
  }

  const screenWidth = window.innerWidth

  const matches = Object.values(screenDimention).filter(v => screenWidth >= v)

  const match = Math.max(...matches)

  if (slidesPerViewByDimension[match]) {
    return slidesPerViewByDimension[match][tileSize as TileSize]
  }
  return "auto"
}
