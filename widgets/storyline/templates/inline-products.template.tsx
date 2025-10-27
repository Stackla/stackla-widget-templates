import { createElement, createFragment } from "@stackla/widget-utils/jsx"
import { Sdk, TagExtended, Tile } from "@stackla/widget-utils"

type SwiperTemplateProps = {
  tile: Tile
  navArrows: boolean
  prevIcon: string
  nextIcon: string
  sdk: Sdk
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function InlineProductsTemplate(sdk: Sdk, component: any) {
  if (!component.tile) {
    return <></>
  }

  return (
    <ProductTagsSwiperTemplate
      tile={component.tile}
      navArrows={component.arrows}
      prevIcon={component.prevIcon}
      nextIcon={component.nextIcon}
      sdk={sdk}
    />
  )
}

export function ProductTagsSwiperTemplate({ tile, navArrows, prevIcon }: SwiperTemplateProps) {
  const products: TagExtended[] = (tile.tags_extended || []).filter(({ type }) => type === "product")

  if (!tile || !products || !products.length) {
    return <></>
  }

  return (
    <>
      <div class="inline-products-wrapper">
        {navArrows && (
          <div class="swiper-inline-products-button-prev swiper-button-prev btn-lg">
            <span class={`swiper-nav-icon ${prevIcon}`} />
          </div>
        )}

        <div class="expand-control expanded">
          <div class="down-arrow"></div>
          <span class="expand-control-label">Product</span>
        </div>

        <div class="swiper swiper-inline-products">
          <div class="swiper-inline-products-wapper swiper-wrapper">
            {products.map(product => (
              <div class="tile-product swiper-slide">
                <div class="tile-product-left-panel">
                  <img
                    onClick={() => (window.location.href = product.custom_url)}
                    draggable="false"
                    highlight="false"
                    src={product.image_small_url}
                    class="inline-product-img"
                  />
                </div>
                <div class="tile-product-right-panel">
                  <ProductHeader product={product}></ProductHeader>
                  <ProductDescription product={product}></ProductDescription>
                  <ProductPrice product={product}></ProductPrice>
                  <ProductCTA product={product} tile={tile}></ProductCTA>
                </div>
                <MobileProductCTA product={product} tile={tile}></MobileProductCTA>
              </div>
            ))}
          </div>
        </div>

        <div class="expand-control collapsed">
          <div class="up-arrow"></div>
          <span class="expand-control-label">Product</span>
        </div>

        <div class="swiper-pagination"></div>
      </div>
    </>
  )
}

function ProductHeader({ product }: { product: TagExtended }) {
  if (!product || !product.tag) return <></>

  return <div class="stacklapopup-inline-products-item-title">{getTitleFromProductTag(product.tag)}</div>
}

function getColorFromProductTag(tag: string) {
  const color = tag.split("|")[1]
  return color ? color.trim() : ""
}

function getTitleFromProductTag(tag: string) {
  const tile = tag.split("|")[0]
  return tile ? tile.trim() : ""
}

function ProductDescription({ product }: { product: TagExtended }) {
  if (!product) return <></>

  return <div class="stacklapopup-inline-products-item-description">{getColorFromProductTag(product.tag)}</div>
}

export function stripMetaCurrencySymbols(price: string) {
  // eslint-disable-next-line no-useless-escape
  const pattern = /[^\$\€\£\¥\₹\₩\₽\฿\₫\d\.,]/g
  if (!price) return ""
  return price.replace(pattern, "").trim()
}

function ProductPrice({ product }: { product: TagExtended }) {
  if (!product || !product.price) return <></>
  const { price } = product

  return <div class="stacklapopup-inline-products-item-price">{stripMetaCurrencySymbols(price)}</div>
}

function ProductCTA({ product, tile }: { product: TagExtended; tile: Tile }) {
  const { custom_url, cta_text = "Buy Now" } = product
  const buttonText = cta_text

  return (
    <a
      href={custom_url}
      target={"_self"}
      className={`stacklapopup-inline-products-item-button-wrap add-to-cart-button-wrap`}
      data-tile-id={tile.id}>
      <span className={`stacklapopup-inline-products-item-button`}>{buttonText}</span>
    </a>
  )
}
function MobileProductCTA({ product, tile }: { product: TagExtended; tile: Tile }) {
  const { custom_url } = product

  return (
    <a
      href={custom_url}
      target={"_self"}
      className={`stacklapopup-product-mobile-overlay-link`}
      data-tile-id={tile.id}></a>
  )
}
