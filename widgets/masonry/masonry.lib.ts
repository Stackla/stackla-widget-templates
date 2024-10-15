import { MasonryLayout } from "@appnest/masonry-layout"
import { Sdk } from "@stackla/ugc-widgets"

declare const sdk: Sdk

export function randomHeight(): number {
  return randomNumberInRange(300, 600)
}

function randomNumberInRange(from: number, to: number): number {
  return Math.floor(Math.random() * (to - from + 1)) + from
}

export function resizeAllUgcTiles() {
  const ugcTiles = sdk.querySelectorAll<HTMLElement>(".ugc-tile img")

  if (!ugcTiles) {
    throw new Error("Failed to find tiles wrapper")
  }

  ugcTiles.forEach((tile: HTMLElement) => {
    tile.style.height = `${randomHeight()}px`
  })

  const masonryLayout = sdk.querySelector<MasonryLayout>("masonry-layout")
  if (masonryLayout && masonryLayout instanceof MasonryLayout) {
    masonryLayout.layout()
  }
}
