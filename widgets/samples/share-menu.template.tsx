import type { ISdk, IShareMenuComponent, Tile } from "@stackla/widget-utils"
import { createElement, createFragment } from "@stackla/widget-utils/jsx"

export function ShareMenuTemplate(_sdk: ISdk, component: IShareMenuComponent) {
  const tile = component.tile
  const theme = component.theme

  if (!tile) {
    return <></>
  }

  return (
    <>
      <div class="share-button">
        <span class={`widget-icon icon-share ${theme}`} alt="Share button"></span>
      </div>
      <div class="share-socials-popup-wrapper">
        <div class="panel-overlay"></div>
        <div class="share-socials-popup">
          <a class="share-modal-exit" href="#">
            <span class="widget-icon close-white" alt="Exit button"></span>
          </a>
          <div class="popup-text">Share Now</div>
          <div class="ugc-inline-share-buttons">
            <MenuLink icon="facebook" tile={tile} />
            <MenuLink icon="x" tile={tile} />
            <MenuLink icon="pinterest" tile={tile} />
            <MenuLink icon="linkedin" tile={tile} />
            <MenuLink icon="email" tile={tile} />
          </div>
          <div class="url-copy">
            <div class="url-controls">
              <input class="share-url" type="text" id="share-url" value={tile.original_url} readonly />
              <button class="copy-button" data-action="copy">
                Copy
              </button>
            </div>
            <span class="copy-status"></span>
          </div>
        </div>
      </div>
    </>
  )
}

function MenuLink({ tile, icon }: { tile: Tile; icon: string }) {
  const url = new URL(`https://www.addtoany.com/add_to/${icon}`)
  url.searchParams.append("linkurl", tile.original_url)
  if (tile.name) {
    url.searchParams.append("linkname", tile.name)
  }
  const href = url.href
  const alt = `${icon} logo`

  return <a href={href} target="_blank" className={`widget-icon icon-${icon}-share`} alt={alt} />
}
