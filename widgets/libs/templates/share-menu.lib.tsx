import { Tile } from "@stackla/ugc-widgets"
import { createElement } from "jsx-html"

export function ShareMenu(tile: Tile, showMenu: boolean) {
  return (
    showMenu && (
      <div class="ugc-inline-share-buttons">
        <MenuLink icon="facebook" tile={tile} />
        <MenuLink icon="x" tile={tile} />
        <MenuLink icon="pinterest" tile={tile} />
        <MenuLink icon="linkedin" tile={tile} />
        <MenuLink icon="email" tile={tile} />
      </div>
    )
  )
}

function MenuLink({ tile, icon }: { tile: Tile; icon: string }) {
  const url = new URL(`https://www.addtoany.com/add_to/${icon}`)
  url.searchParams.append("linkurl", tile.original_url)
  tile.name && url.searchParams.append("linkname", tile.name)
  const href = url.href

  return (
    <a href={href} target="_blank">
      <img
        src={`https://static.addtoany.com/buttons/${icon}.svg`}
        width="32"
        height="32"
        style="background-color:#333"
      />
    </a>
  )
}
