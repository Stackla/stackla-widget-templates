import type { Sdk } from "@stackla/ugc-widgets";

export default (sdk: Sdk) => {
  const tile = sdk.tiles.getTile();
  const shopspotEnabled = sdk.isComponentLoaded("shopspots");
  const productsEnabled = sdk.isComponentLoaded("products");
  const parent = sdk.getNodeId();

  return `<div class="panel">
        <a class="exit" href="#">Close</a>
        <div class="panel-left">
            <div class="image-wrapper">
                <div class="image-wrapper-inner">
                    <div class="image">
                        ${shopspotEnabled ? `<shopspot-flyout parent="${parent}"></shopspot-flyout>` : ""}
                        ${shopspotEnabled ? `<shopspot-icon parent="${parent}"/></shopspot-icon>` : ""}
                        ${tile.image ? `<img class="image-element" src="${tile.image}" />` : ""}
                    </div>
                </div>
            </div>
            <div>
                <span class="source">
                    <i class="fs fs-${tile.source}"></i>
                </span>
            </div>
        </div>
        <div class="panel-right">
            <div class="panel-right-wrapper">
                <div class="content-wrapper">
                    <div class="content-inner-wrapper">
                        <div class="user-info-wrapper">
                            <div class="user-info">
                                ${
                                  tile.avatar
                                    ? `<span class="avatar-wrapper">
                                    <a class="avatar-link" href="${tile.original_url}" target="_blank">
                                       <img src="${tile.avatar}">
                                    </a>
                                </span>`
                                    : ""
                                }
                                ${
                                  tile.user
                                    ? `<a class="user-link" href="${tile.original_url}" target="_blank">
                                    <div class="user-top">
                                        <span class="user-name">${tile.user}</span>
                                    </div>
                                    <div class="user-bottom">
                                        <span class="user-handle">@${tile.user}</span>
                                    </div>
                                </a>`
                                    : ""
                                }
                            </div>
                        </div>
                        <div class="caption">
                            <p class="caption-paragraph">${tile.message ?? ""}</p>
                            ${productsEnabled ? `<ugc-products parent="${parent}">` : ""}
                        </div>
                        <div class="footer">
                            <span class="base-v2 source source-instagram">
                                <i class="fs fs-instagram"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>`;
};
