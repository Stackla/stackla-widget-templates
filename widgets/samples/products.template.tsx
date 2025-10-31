import type { ISdk, TagExtended, IProductsComponent, Tile } from "@stackla/widget-utils"
import { createElement, createFragment } from "@stackla/widget-utils/jsx"

export function ProductHeader({ product }: { product: TagExtended }) {
  if (!product) return <></>

  const { id, tag, custom_url, target, price, currency } = product

  const titleContent = tag && (
    <a href={custom_url} target={target} class="stacklapopup-products-item-title">
      {tag}
    </a>
  )

  const priceContent = price && (
    <div class="stacklapopup-products-item-price">{currency === "EUR" ? `${price}` : `${currency ?? ""}${price}`}</div>
  )

  return (
    <div class="stacklapopup-products-header">
      <div class="stacklapopup-products-item-header stacklapopup-products-item-active" data-tag-id={id}>
        {titleContent}
        {priceContent}
      </div>
    </div>
  )
}

export function ProductCTA({ sdk, product, tile }: { sdk: ISdk; product: TagExtended; tile: Tile }) {
  const { custom_url, target, availability, cta_text = "Buy Now", currency, id } = product
  const addToCart = sdk.getLoadedComponents().includes("add-to-cart")
  const parentNodeId = sdk.getNodeId()
  if (addToCart) {
    return (
      <>
        <add-to-cart
          tile-id={tile.id}
          productId={id}
          id={`stacklapopup-add-to-cart-${id}-${tile.id}`}
          url={custom_url}
          target={target}
          availability={availability}
          cta={cta_text}
          currency={currency}
          parent={parentNodeId}></add-to-cart>
      </>
    )
  }

  return (
    <a href={custom_url} target={target} class="stacklapopup-products-item-button-wrap">
      <span className={`stacklapopup-products-item-button${availability ? "" : " disabled"}`}>{cta_text}</span>
    </a>
  )
}

export function ProductDetails({ sdk, product, tile }: { sdk: ISdk; product: TagExtended; tile: Tile }) {
  const selectedProduct = sdk.getSelectedProduct()
  const selectedProductId = selectedProduct ? selectedProduct.id : null
  const { custom_url, description = "Buy Now", id } = product

  const descriptionContent = description ? <p class="stacklapopup-products-item-description">{description}</p> : <></>

  const itemActive = id == selectedProductId ? "stacklapopup-products-item-active" : ""

  return (
    <div className={`stacklapopup-products-item-content ${itemActive}`} data-tag-id={id} data-custom-url={custom_url}>
      <div className="stacklapopup-products-item-description-wrapper">{descriptionContent}</div>
      <ProductCTA tile={tile} sdk={sdk} product={product}></ProductCTA>
    </div>
  )
}

export function ProductWrapper({
  products,
  selectedProductId
}: {
  products: TagExtended[]
  selectedProductId: string
}) {
  return (
    <>
      {products.map(({ id, image_small_url, is_cross_seller }) => (
        <div className="swiper-slide stacklapopup-product-wrapper">
          {is_cross_seller && (
            <div className="stacklapopup-products-item-image-recommendation-label">
              <p>
                <span class="icon-like"></span> great with
              </p>
            </div>
          )}
          <div
            className={`stacklapopup-products-item ${is_cross_seller ? "cross-seller" : ""} ${id == selectedProductId ? "stacklapopup-products-item-active" : ""}`}
            data-tag-id={id}>
            <img
              loading="lazy"
              class="stacklapopup-products-item-image"
              src={image_small_url}
              onerror="this.src='https://placehold.co/160x200'"
            />
          </div>
        </div>
      ))}
    </>
  )
}

export function ProductImages({
  products,
  selectedProduct
}: {
  products: TagExtended[]
  selectedProduct: TagExtended
}) {
  return (
    <>
      {products.length > 3 ? <div class="recommendations-text">see recommendations</div> : <></>}
      <div class={`stacklapopup-product-images-wrapper ${products.length <= 3 ? "arrows-hidden" : ""}`}>
        <div
          className={`swiper swiper-expanded-product-recs stacklapopup-products ${products.length <= 3 ? "arrows-hidden" : ""}`}>
          <div class="swiper-wrapper">
            {selectedProduct && (
              <ProductWrapper products={products} selectedProductId={selectedProduct.id}></ProductWrapper>
            )}
          </div>
        </div>
        <div class="swiper-exp-product-recs-button-prev swiper-button-prev" aria-label="Previous product image">
          <span class="swiper-nav-icon icon-prev" />
        </div>
        <div class="swiper-exp-product-recs-button-next swiper-button-next" aria-label="Next product image">
          <span class="swiper-nav-icon icon-next" />
        </div>
      </div>
    </>
  )
}

export default function ProductsTemplate(sdk: ISdk, component: IProductsComponent) {
  const tileId = component.getTileId()
  const tile = sdk.getTileById(tileId)
  const selectedProductState = sdk.getSelectedProduct()

  if (!tile) {
    throw new Error("No tile found")
  }

  const products: TagExtended[] = (tile.tags_extended || []).filter(({ type }) => type === "product")

  if (!products.length) {
    return <></>
  }

  const selectedProductById = selectedProductState
    ? products.find(({ id }) => id == selectedProductState.id.toString())
    : null

  const selectedProduct: TagExtended = selectedProductById || products[0]
  const mappedProducts = products.map(product => (
    <ProductDetails tile={tile} sdk={sdk} product={product}></ProductDetails>
  ))

  return (
    <>
      <ProductHeader product={selectedProduct}></ProductHeader>
      <ProductImages products={products} selectedProduct={selectedProduct}></ProductImages>
      {mappedProducts}
    </>
  )
}
