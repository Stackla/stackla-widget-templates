import { createElement } from "@stackla/widget-utils"
import { ShareMenu } from "./share-menu.lib"
import tiles from "../../../../../../../tests/fixtures/tiles"

describe("Share menu rendering", () => {
  it("should render share menu for the provided tile", () => {
    const rendered = <ShareMenu tile={tiles[0]} />

    //Social Icons
    const socialItems = (
      <div class="ugc-inline-share-buttons">
        <div class="share-socials-popup">
          <a class="share-modal-exit" href="#">
            <span class="widget-icon close-white" alt="Exit button"></span>
          </a>
          <div class="popup-text">Share Now</div>
          <div class="ugc-inline-share-buttons">
            <a
              href="https://www.addtoany.com/add_to/facebook?linkurl=https%3A%2F%2Fwww.instagram.com%2Fp%2FC39cmngOe2j%2F&amp;linkname=modelemasculine"
              target="_blank"
              class="widget-icon icon-facebook-share"
              alt="facebook logo"></a>
            <a
              href="https://www.addtoany.com/add_to/instagram?linkurl=https%3A%2F%2Fwww.instagram.com%2Fp%2FC39cmngOe2j%2F&amp;linkname=modelemasculine"
              target="_blank"
              class="widget-icon icon-instagram-share"
              alt="instagram logo"></a>
            <a
              href="https://www.addtoany.com/add_to/x?linkurl=https%3A%2F%2Fwww.instagram.com%2Fp%2FC39cmngOe2j%2F&amp;linkname=modelemasculine"
              target="_blank"
              class="widget-icon icon-x-share"
              alt="x logo"></a>
            <a
              href="https://www.addtoany.com/add_to/pinterest?linkurl=https%3A%2F%2Fwww.instagram.com%2Fp%2FC39cmngOe2j%2F&amp;linkname=modelemasculine"
              target="_blank"
              class="widget-icon icon-pinterest-share"
              alt="pinterest logo"></a>
            <a
              href="https://www.addtoany.com/add_to/linkedin?linkurl=https%3A%2F%2Fwww.instagram.com%2Fp%2FC39cmngOe2j%2F&amp;linkname=modelemasculine"
              target="_blank"
              class="widget-icon icon-linkedin-share"
              alt="linkedin logo"></a>
            <a
              href="https://www.addtoany.com/add_to/email?linkurl=https%3A%2F%2Fwww.instagram.com%2Fp%2FC39cmngOe2j%2F&amp;linkname=modelemasculine"
              target="_blank"
              class="widget-icon icon-email-share"
              alt="email logo"></a>
          </div>
          <div class="url-copy">
            <div class="url-controls">
              <input
                class="share-url"
                type="text"
                id="share-url"
                value="https://www.instagram.com/p/C39cmngOe2j/"
                readonly="true"
              />
              <button class="copy-button" data-action="copy">
                Copy
              </button>
            </div>
            <span class="copy-status"></span>
          </div>
        </div>
      </div>
    )
    expect(rendered.innerHTML).toContain(socialItems.innerHTML)

    const urlCopyElement = (
      <div class="url-copy">
        <div class="url-controls">
          <input
            class="share-url"
            type="text"
            id="share-url"
            value="https://www.instagram.com/p/C39cmngOe2j/"
            readonly="true"
          />
          <button class="copy-button" data-action="copy">
            Copy
          </button>
        </div>
        <span class="copy-status"></span>
      </div>
    )

    expect(rendered.innerHTML).toContain(urlCopyElement.innerHTML)
  })
})
