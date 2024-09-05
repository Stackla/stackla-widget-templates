import type { Tile } from "@stackla/ugc-widgets"
import { createElement } from "jsx-html"

export const SharingButtons = ({ tile }: { tile: Tile }) => {
  const platforms = [
    { name: "facebook", url: "https://static.addtoany.com/buttons/facebook.svg" },
    { name: "x", url: "https://static.addtoany.com/buttons/x.svg" },
    { name: "pinterest", url: "https://static.addtoany.com/buttons/pinterest.svg" },
    { name: "linkedin", url: "https://static.addtoany.com/buttons/linkedin.svg" },
    { name: "email", url: "https://static.addtoany.com/buttons/email.svg" }
  ]

  return (
    <div className="ugc-inline-share-buttons">
      {platforms.map(platform => (
        <a
          key={platform.name}
          href={`https://www.addtoany.com/add_to/${platform.name}?linkurl=${tile.original_url}&linkname=${tile.name}`}
          target="_blank"
          rel="noopener noreferrer">
          <img
            src={platform.url}
            width="32"
            height="32"
            style={{ backgroundColor: "#333" }}
            alt={`Share on ${platform.name}`}
          />
        </a>
      ))}
    </div>
  )
}
