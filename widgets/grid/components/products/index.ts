import { Sdk } from "@stackla/ugc-widgets"
import productsStyle from "./base.scss"

declare const sdk: Sdk

export function loadProductsTemplate() {
  sdk.addCSSToComponent(productsStyle, "ugc-products")
}
