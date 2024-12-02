import { ISdk, createElement } from "@stackla/widget-utils"

declare const sdk: ISdk
declare const WIDGET_ENDPOINT: string
declare const DIRECT_UPLOADER_ENDPOINT: string

const createDUIFrame = (guid: string) => {
  const directUploaderSource = `${DIRECT_UPLOADER_ENDPOINT}/widget/show?v=1&plugin_id=${guid}`

  return <iframe src={directUploaderSource} width="100%" height="100%" frameborder="0"></iframe>
}

const defaultTemplate = (
  <a class="exit" href="#">
    <span class="widget-icon close-white"></span>
  </a>
)

class DirectUploaderWidget extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    this.appendChild(defaultTemplate)

    const widgetId = sdk.placement.getWidgetId()
    const settings = sdk.getStyleConfig()
    const { plugin_instance_id } = settings

    let widgetEndpoint = `${WIDGET_ENDPOINT}/widgets/${widgetId}/direct-uploader/${plugin_instance_id}`

    if (!plugin_instance_id || plugin_instance_id === "0") {
      widgetEndpoint = `${WIDGET_ENDPOINT}/widgets/${widgetId}/direct-uploader`
    }

    try {
      const response = await fetch(widgetEndpoint)
      const { guid } = await response.json()
      this.appendChild(createDUIFrame(guid))

      loadDirectUploaderListeners()
    } catch (error) {
      console.error(`Failed to fetch direct uploader widget: ${error}`)
    }
  }
}

try {
  customElements.define("direct-uploader", DirectUploaderWidget)
} catch (error) {
  // eslint-disable-next-line no-console
}

export function loadDirectUploaderListeners() {
  const submitMoreContentBtn = sdk.querySelector("#submit-more-content-btn")
  const directUploaderForm = sdk.querySelector("#direct-uploader-form")
  const overlay = sdk.querySelector("#direct-uploader-form .overlay")
  const exitBtn = sdk.querySelector("#direct-uploader-form .exit")

  if (!submitMoreContentBtn) {
    throw new Error("Failed to find submit more content button")
  }

  if (!directUploaderForm) {
    throw new Error("Failed to find direct uploader form")
  }

  if (!overlay) {
    throw new Error("Failed to find overlay")
  }

  if (!exitBtn) {
    throw new Error("Failed to find exit button")
  }

  submitMoreContentBtn.addEventListener("click", () => {
    directUploaderForm.classList.remove("hidden")
  })

  exitBtn.addEventListener("click", () => {
    directUploaderForm.classList.add("hidden")
  })

  overlay.addEventListener("click", () => {
    directUploaderForm.classList.add("hidden")
  })
}
