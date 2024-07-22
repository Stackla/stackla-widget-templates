import type { Sdk } from "@stackla/ugc-widgets";

declare const sdk: Sdk;

export function addCSSVariablesToPlacement(cssVariables: string) {
  const shadowRoot = sdk.placement.getShadowRoot();
  const style = document.createElement("style");
  style.innerHTML = `
      :host {
          ${cssVariables}
      }`;
  shadowRoot.appendChild(style);
}
