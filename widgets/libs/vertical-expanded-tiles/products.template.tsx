import { createElement, createFragment } from "@stackla/widget-utils/jsx"
import type { IProductsComponent, Sdk, TagExtended, Tile, ISdk } from "@stackla/widget-utils/types"

declare const sdk: ISdk

export function ProductCTA({ product }: { sdk: Sdk; product: TagExtended; tile: Tile }) {
  const { custom_url, target, availability, cta_text = "Buy Now" } = product

  return (
    <>
      <a href={custom_url} target={target} class="stacklapopup-products-item-button-wrap">
        <span className={`stacklapopup-products-item-button${availability ? "" : " disabled"}`}>{cta_text}</span>
      </a>
    </>
  )
}

export function ProductDetails({ sdk, product, tile }: { sdk: Sdk; product: TagExtended; tile: Tile }) {
  const selectedProduct = sdk.getSelectedProduct()
  const selectedProductId = selectedProduct ? selectedProduct.id : null
  const { custom_url, id } = product

  const itemActive = id == selectedProductId ? "stacklapopup-products-item-active" : ""

  return (
    <>
      <div className={`stacklapopup-products-item-content ${itemActive}`} data-tag-id={id} data-custom-url={custom_url}>
        <ProductCTA tile={tile} sdk={sdk} product={product}></ProductCTA>
      </div>
    </>
  )
}

export function ProductWrapper({
  products,
  selectedProductId,
  component
}: {
  products: TagExtended[]
  selectedProductId: string
  component: IProductsComponent
}) {
  const tileId = component?.getTileId()
  const tile = sdk.getTileById(tileId)

  if (!tile) {
    throw new Error("No tile found")
  }

  return (
    <>
      {products.map(product => {
        const { id, image_small_url, is_cross_seller } = product

        return (
          <div key={id} className="stacklapopup-product-wrapper">
            <div
              className={`stacklapopup-products-item ${is_cross_seller ? "cross-seller" : ""} ${id === selectedProductId ? "stacklapopup-products-item-active" : ""}`}
              data-tag-id={id}>
              <img
                loading="lazy"
                className="stacklapopup-products-item-image"
                src={image_small_url}
                onerror="this.src='https://placehold.co/160x200'"
              />
              <ProductDetails tile={tile} sdk={sdk} product={product} />
            </div>
          </div>
        )
      })}
    </>
  )
}

export function ProductImages({
  products,
  selectedProduct,
  component
}: {
  products: TagExtended[]
  selectedProduct: TagExtended
  component: IProductsComponent
}) {
  return (
    <>
      <div class={`stacklapopup-product-images-wrapper ${products.length <= 3 ? "arrows-hidden" : ""}`}>
        <div className={`stacklapopup-products ${products.length <= 3 ? "arrows-hidden" : ""}`}>
          <div class="">
            {selectedProduct && (
              <ProductWrapper
                products={products}
                selectedProductId={selectedProduct.id}
                component={component}></ProductWrapper>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default function ProductsTemplate(sdk: Sdk, component?: IProductsComponent) {
  const tileId = component && component.getTileId()

  if (!tileId) {
    console.warn("No tile id found in ProductsTemplate")
    return <></>
  }

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

  return (
    <>
      <ProductImages products={products} selectedProduct={selectedProduct} component={component}></ProductImages>
    </>
  )
}
