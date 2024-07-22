import type { Sdk, TagExtended } from "@stackla/ugc-widgets";

export function getProductHeaderDiv(product: TagExtended): string {
  const { id, tag, custom_url, target, price } = product;

  const titleContent = tag
    ? `<a href="${custom_url}" target="${target}" class="stacklapopup-products-item-title-wrap">
          <div class="stacklapopup-products-item-title">${tag}</div>
        </a>`
    : "";

  const priceContent = price
    ? `<div class="stacklapopup-products-item-price">${price}</div>`
    : "";

  return `<div class="stacklapopup-products-header">
            <div class="stacklapopup-products-item-header stacklapopup-products-item-active" data-tag-id="${id}">
              ${titleContent}
              ${priceContent}
            </div>
          </div>`;
}

export function getProductDetailsDiv(sdk: Sdk): string {
  const products = sdk.tiles.getProductsFromTile();

  return products
    .map((product: TagExtended) => renderProductDetailsDiv(sdk, product))
    .join("");
}

export function renderProductDetailsDiv(
  sdk: Sdk,
  product: TagExtended,
): string {
  const addToCart = sdk.getLoadedComponents().includes("add-to-cart");
  const parentNodeId = sdk.getNodeId();
  const selectedProductId = sdk.tiles.getSelectedProduct().id;

  let callToAction = "";
  const {
    custom_url,
    target,
    description,
    availability,
    cta_text = "Buy Now",
    currency,
    id,
  } = product;

  if (addToCart) {
    callToAction = `
        <a href="${custom_url}" target="${target}" class="stacklapopup-products-item-button-wrap" style="display:none;">
            <span class="stacklapopup-products-item-button ${availability ? "" : "disabled"}">${cta_text}</span>
        </a>
        <add-to-cart 
            productId="${id}"
            id="stacklapopup-add-to-cart-${id}" 
            url="${custom_url}" 
            target="${target}" 
            availability="${availability}" 
            cta="${cta_text}"
            currency="${currency}"
            parent="${parentNodeId}">    
        </add-to-cart>`;
  } else {
    callToAction = `<a href="${custom_url}" target="${target}" class="stacklapopup-products-item-button-wrap">
                      <span class="stacklapopup-products-item-button ${availability ? "" : "disabled"}">${cta_text}</span>
                    </a>`;
  }

  const descriptionContent = description
    ? `<p class="stacklapopup-products-item-description">${description}</p>`
    : "";

  const itemActive =
    id == selectedProductId ? "stacklapopup-products-item-active" : "";

  return `<div class="stacklapopup-products-item-content ${itemActive}" data-tag-id="${id}" data-custom-url="${custom_url}">
              <div class="stacklapopup-products-item-description-wrapper">
                ${descriptionContent}
              </div>
              ${callToAction}
            </div>`;
}

export function renderCrossSellersDiv(
  products: TagExtended[],
  selectedProductId: string,
) {
  const productsHTML = products
    .map(
      ({ id, image_small_url, is_cross_seller }) =>
        `<div class="stacklapopup-products-item ${is_cross_seller ? "cross-seller" : ""} ${id == selectedProductId ? "stacklapopup-products-item-active" : ""}" data-tag-id="${id}">
            ${
              is_cross_seller
                ? `<div class="stacklapopup-products-item-image-recommendation-label"><p><span class="star"></span> great with</p></div>`
                : ``
            }
            <div class="stacklapopup-products-item-image" style="background-image: url(${image_small_url})"></div>
        </div>`,
    )
    .join("");

  return `${productsHTML}`;
}

export function getProductImagesDiv(
  products: TagExtended[],
  selectedProductId: string,
  crossSellersEnabled: boolean,
): string {
  return `<div class="stacklapopup-product-images-wrapper">
              <div class="stacklapopup-products">
                ${renderCrossSellersDiv(products, selectedProductId)}
                ${crossSellersEnabled ? `<div class="loader"></div>` : ""}
              </div>
            </div>`;
}

export default function productsTemplate(sdk: Sdk): string {
  const crossSellersEnabled = sdk.isComponentLoaded("cross-sellers");
  const parentSelector = sdk.getNodeId();
  const tile = sdk.tiles.getTile();
  const productId = sdk.tiles.getSelectedProduct();

  if (!tile) {
    throw new Error("No tile found");
  }

  const products: TagExtended[] = (tile.tags_extended || []).filter(
    (tag: TagExtended) => tag.type === "product",
  );

  if (!products) {
    return "";
  }

  const selectedProductById = products.find(
    ({ id }) => id == productId.toString(),
  );
  const selectedProduct: TagExtended = selectedProductById || products[0];

  return `<div class="stacklapopup-products-wrap">
            ${crossSellersEnabled ? `<cross-sellers parent="${parentSelector}"></cross-sellers>` : ""}
            ${getProductHeaderDiv(selectedProduct)}
            ${getProductImagesDiv(products, selectedProduct.id, crossSellersEnabled)}
            ${getProductDetailsDiv(sdk)}
          </div>`;
}
