import type { Sdk, Hotspot } from "@stackla/ugc-widgets";

export default function shopspotFlyoutTemplate(sdk: Sdk): string {
  const shopspots = sdk.tiles.getShopspotsFromTile();

  if (shopspots.length === 0) {
    return "";
  }

  const shopspotsContainer = shopspots.map(
    (shopspot: Hotspot, index: number) => {
      const x = shopspot.coords[0];
      const y = shopspot.coords[1];
      const tagId = shopspot.tag.id;
      const tagName = shopspot.tag.tag;

      return `<div class="stacklapopup-shopspot" data-tag-id="${tagId}" style="left: ${x}%; top: ${y}%">
        <div>
          <p class="stacklapopup-shopspot-icon" data-tag-id="${tagId}"><span data-tag-id="${tagId}">${index + 1}</span></p>
          <div class="stacklapopup-shopspot-flyout-title" data-tag-id="${tagId}">${tagName}</div>
        </div>
    </div>`;
    },
  );

  return `<div class="shopspots">
      ${shopspotsContainer}
  </div>`;
}
