import { useClipboard } from "@libs/clipboard-polyfills"

export async function copyToClipboard(inputElement: HTMLInputElement) {
  try {
    const writeText = useClipboard()
    await writeText(inputElement)
    const buttonElement = inputElement.closest(".url-copy")?.querySelector<HTMLElement>(".copy-button")
    if (buttonElement) {
      buttonElement.textContent = "Copied"
      setInterval(() => {
        buttonElement.textContent = "Copy"
      }, 2000)
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to copy text: ", err)
  }
}

function reduceBackgroundControlsVisibility(expandedTilesElement: HTMLElement) {
  const navigationPrevButton =
    expandedTilesElement.shadowRoot!.querySelector<HTMLElement>(".swiper-expanded-button-prev")
  const navigationNextButton =
    expandedTilesElement.shadowRoot!.querySelector<HTMLElement>(".swiper-expanded-button-next")
  const exitTileButton = expandedTilesElement.shadowRoot!.querySelector<HTMLElement>(".exit")

  navigationNextButton?.classList.add("swiper-button-disabled")
  navigationPrevButton?.classList.add("swiper-button-disabled")

  if (exitTileButton) {
    exitTileButton.style.opacity = "0.4"
  }
}

function resetBackgroundControlsVisibility(expandedTilesElement: HTMLElement) {
  const navigationPrevButton =
    expandedTilesElement.shadowRoot!.querySelector<HTMLElement>(".swiper-expanded-button-prev")
  const navigationNextButton =
    expandedTilesElement.shadowRoot!.querySelector<HTMLElement>(".swiper-expanded-button-next")
  const exitTileButton = expandedTilesElement.shadowRoot!.querySelector<HTMLElement>(".exit")

  navigationNextButton?.classList.remove("swiper-button-disabled")
  navigationPrevButton?.classList.remove("swiper-button-disabled")

  if (exitTileButton) {
    exitTileButton.removeAttribute("style")
  }
}

function addShareMenuListeners(expandedTilesElement: HTMLElement, shareMenuWrapper: HTMLElement, tile: Element) {
  // Exit button listener
  const shareExitButton = shareMenuWrapper.querySelector<HTMLElement>(".share-modal-exit")
  const panelOverlay = tile.querySelector<HTMLElement>(".panel-overlay")
  const panelRightWrapper = tile.querySelector<HTMLElement>(".panel-right-wrapper")

  if (shareExitButton) {
    shareExitButton.addEventListener("click", shareExitButtonEvent => {
      shareExitButtonEvent.preventDefault()
      shareExitButtonEvent.stopPropagation()
      shareMenuWrapper.style.display = "none"
      panelOverlay?.classList.remove("active")

      if (panelRightWrapper) {
        panelRightWrapper.removeAttribute("style")
      }
      resetBackgroundControlsVisibility(expandedTilesElement)
    })
  }

  // copy to clipboard listener
  const clipboardElement = shareMenuWrapper.querySelector<HTMLElement>(".url-copy .copy-button")
  const shareUrlElement = shareMenuWrapper.querySelector<HTMLInputElement>(".url-copy .share-url")

  if (shareUrlElement && clipboardElement) {
    clipboardElement.addEventListener("click", () => copyToClipboard(shareUrlElement))
  }
}

export function registerExpandedTileShareMenuListeners(
  expandedTilesElement: HTMLElement,
  shareButtonElement: HTMLElement,
  tile: Element
) {
  shareButtonElement.addEventListener("click", (shareButtonEvent: MouseEvent) => {
    shareButtonEvent.preventDefault()
    shareButtonEvent.stopPropagation()
    const wrapper = tile.querySelector<HTMLElement>(".share-socials-popup-wrapper")
    const panelOverlay = tile.querySelector<HTMLElement>(".panel-overlay")
    const panelRightWrapper = tile.querySelector<HTMLElement>(".panel-right-wrapper")

    if (!wrapper) {
      throw new Error("Share menu wrapper not found")
    }
    wrapper.style.display = "block"
    panelOverlay?.classList.add("active")

    if (panelRightWrapper) {
      panelRightWrapper.style.overflow = "unset"
    }
    reduceBackgroundControlsVisibility(expandedTilesElement)
    addShareMenuListeners(expandedTilesElement, wrapper, tile)
  })
}
