import type { Sdk } from "@stackla/types"

export default async function shopspotFlyoutTemplate(sdk: Sdk): Promise<string> {
  const shopspots = await sdk.tiles.getShopspotsFromTile()

  if (shopspots.length === 0) {
    return ""
  }

  const shopspotsContainer = shopspots.map((shopspot, index) => {
    const x = shopspot.coords[0]
    const y = shopspot.coords[1]
    const tagId = shopspot.tag.id
    const tagName = shopspot.tag.tag

    return `<div class="stacklapopup-shopspot" data-tag-id="${tagId}" style="left: ${x}%; top: ${y}%">
        <div>
          <p class="stacklapopup-shopspot-icon" data-tag-id="${tagId}"><span data-tag-id="${tagId}">${index + 1}</span></p>
          <div class="stacklapopup-shopspot-flyout-title" data-tag-id="${tagId}">${tagName}</div>
        </div>
    </div>`
  })

  return `<div class="shopspots">
      ${shopspotsContainer}
  </div>`
}
