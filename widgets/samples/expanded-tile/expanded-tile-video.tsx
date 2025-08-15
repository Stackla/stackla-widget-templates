import { type SwiperType } from "@stackla/widget-utils/types"
import { getSwiperSlideById, getTileIdFromSlide, isActiveTile } from "./expanded-swiper.loader"
import { getInstance, getSwiperContainer, LookupAttr } from "@stackla/widget-utils/extensions"
import { ISdk } from "@stackla/widget-utils"
import { playTiktokVideo, muteTiktokVideo, pauseTiktokVideo } from "./tiktok-message"

type YoutubeContentWindow = Window & {
  play: () => void
  pause: () => void
  reset: () => void
  mute: () => void
  unMute: () => void
}

export type YoutubeIframeElementType = HTMLIFrameElement & {
  contentWindow: YoutubeContentWindow
}

type SwiperVideoElementType = Window | YoutubeContentWindow | HTMLVideoElement

type VideoSource = "video" | "youtube" | "tiktok"

type SwiperVideoElementData = {
  element: SwiperVideoElementType
  source: VideoSource
}

let tiktokDefaultPlayed = false

/**
 * Play the video/audio attached to the slide on load where the element is a media element (video/youtube/tiktok)
 */
export async function playMediaOnLoad(sdk: ISdk) {
  const swiper = getInstance(sdk, `expanded`) as SwiperType
  if (swiper) {
    const activeElementData = getSwiperVideoElement(sdk, swiper, swiper.realIndex)
    triggerPlay(sdk, activeElementData)
  }
}

/**
 * Play/Pause the video/audio attached to the slide on navigation where the element is a media element (video/youtube/tiktok)
 * @param { Swiper } swiper - the swiper element
 */
export async function controlVideoPlayback(sdk: ISdk, swiper: SwiperType) {
  const activeElement = getSwiperVideoElement(sdk, swiper, swiper.realIndex)
  const previousElement = getSwiperVideoElement(sdk, swiper, swiper.previousIndex)

  if (activeElement) {
    triggerPlay(sdk, activeElement)
  }

  if (previousElement) {
    triggerPause(previousElement)
  }

  if (!activeElement && !previousElement) {
    console.warn("No active or previous video element found in controlVideoPlayback")
  }
}

/**
 * Trigger media play for different media element sources ("video", "youtube", "tiktok")
 *
 * @param elementData - the media container element and the source
 * @param elementData.element - the container element of the media (video tag or iframe.contentWindow)
 * @param elementData.source - the media source (video for custom video source, youtube/tiktok)
 */
export function triggerPlay(sdk: ISdk, elementData?: SwiperVideoElementData) {
  if (!elementData) {
    console.warn("elementData is required")
    return
  }

  const swiperExpandedId = `expanded`

  switch (elementData.source) {
    case "video": {
      const videoElement = elementData.element as HTMLVideoElement
      void videoElement.play()
      if (getSwiperContainer(sdk, swiperExpandedId)?.muted) {
        videoElement.muted = true
      } else {
        videoElement.muted = false
      }
      break
    }
    case "tiktok": {
      const tiktokFrameWindow = elementData.element as Window
      playTiktokVideo(tiktokFrameWindow)
      muteTiktokVideo(tiktokFrameWindow)
      break
    }
    case "youtube": {
      return
    }
    default:
      throw new Error(`unsupported video source ${elementData.source}`)
  }
}
/**
 * Trigger media pause for different element sources ("video", "youtube", "tiktok")
 *
 * @param elementData - the media container element and the source
 * @param elementData.element - the container element of the media (video tag or iframe.contentWindow)
 * @param elementData.source - the media source (video for custom video source, youtube/tiktok)
 */
export function triggerPause(elementData?: SwiperVideoElementData) {
  if (!elementData) {
    throw new Error("elementData is required")
  }

  switch (elementData.source) {
    case "video": {
      const videoElement = elementData.element as HTMLVideoElement
      videoElement.pause()
      videoElement.currentTime = 0
      break
    }
    case "tiktok": {
      const tiktokFrameWindow = elementData.element as Window
      pauseTiktokVideo(tiktokFrameWindow)
      break
    }
    case "youtube": {
      return
    }
    default:
      throw new Error(`unsupported video source ${elementData.source}`)
  }
}

/**
 * Get swiper video/audio element at the provided index.
 *
 * @param { Swiper } swiper - the swiper element
 * @param { number } index - index of the slide to be returned
 * @param { number } isStory - if it is story widget
 * @returns the video/iframe element or undefined if the element at index is not a video/audio
 */
export function getSwiperVideoElement(
  sdk: ISdk,
  swiper: SwiperType,
  index: number,
  isStory = false
): SwiperVideoElementData | undefined {
  const element = getSwiperSlideById(swiper, index)
  const tileId = getTileIdFromSlide(swiper, index)
  const youtubeId = element?.getAttribute("data-yt-id")

  if (!element) {
    throw new Error(`Failed to find element for the slide at index ${index}`)
  }

  if (!tileId) {
    throw new Error(`Failed to find tile id for the slide at index ${index}`)
  }

  const tile = sdk.getTileById(tileId)

  if (!tile) {
    throw new Error(`Failed to find tile by tile id ${tileId} in getSwiperVideoElement`)
  }

  const media = tile.media

  if (media !== "video" && media !== "short") {
    return undefined
  }

  if (youtubeId) {
    const youtubeFrame = element?.querySelector<YoutubeIframeElementType>(`iframe#yt-frame-${tileId}-${youtubeId}`)
    if (youtubeFrame) {
      return { element: youtubeFrame.contentWindow, source: "youtube" }
    }
  }

  const tiktokId = element?.getAttribute("data-tiktok-id")

  if (tiktokId) {
    const tiktokFrame = element?.querySelector<HTMLIFrameElement>(`iframe#tiktok-frame-${tileId}-${tiktokId}`)
    if (tiktokFrame && tiktokFrame.contentWindow) {
      return { element: tiktokFrame.contentWindow, source: "tiktok" }
    }
  }

  const videoElement = element?.querySelector<HTMLVideoElement>(
    `${isStory ? "" : " .panel .panel-left"} .video-content-wrapper video`
  )

  if (videoElement) {
    return { element: videoElement, source: "video" }
  }

  console.warn("Undefined video element", element, tileId)

  return undefined
}

/**
 * Setup onload and onerror (yt-video-error) events for youtube media
 *
 * @param { Element } tile - the tile element
 * @param { HTMLElement } widgetSelector - the container of swiper element
 */
export function setupYoutubeEvents(sdk: ISdk, tile: Element, widgetSelector: HTMLElement) {
  const tileId = tile.getAttribute("data-id")
  const youtubeId = tile.getAttribute("data-yt-id")

  if (youtubeId && tileId) {
    const youtubeFrame = tile.querySelector<HTMLIFrameElement>(`iframe#yt-frame-${tileId}-${youtubeId}`)
    youtubeFrame?.addEventListener("load", () => {
      playActiveMediaTileOnLoad(sdk, tile, widgetSelector, { name: "data-yt-id", value: youtubeId })
    })
    youtubeFrame?.addEventListener("yt-video-error", () => {
      youtubeFrame.closest(".video-content-wrapper")?.classList.add("hidden")
      tile.querySelector(".video-fallback-content")?.classList.remove("hidden")
    })
  }
}

/**
 * Setup tiktok player events using window.postMessage api
 * All media are paused by defult and only the media in the active slide is played
 */
export function setupTikTokPlayerReadyEvent(sdk: ISdk) {
  tiktokDefaultPlayed = false
  window.onmessage = (
    event: MessageEvent<{
      type: string
      value?: number
      "x-tiktok-player": boolean
    }>
  ) => {
    if (event.data["x-tiktok-player"] && event.data.type === "onPlayerReady") {
      const frameWindow = event.source as Window
      pauseTiktokVideo(frameWindow)

      if (!tiktokDefaultPlayed) {
        tiktokDefaultPlayed = true
        setTimeout(() => playMediaOnLoad(sdk), 300)
      }
    }
  }
}

/**
 * Play media associated with currently active tile
 *
 * @param { Element } tile - tile element to check
 * @param { HTMLElement } widgetSelector - the container of the swiper element
 * @param { LookupAttr } lookupAttr - additional attribute lookup options for finding the first slide to load
 * @param { LookupAttr.name } lookupAttr.name - name of the attribute for e.g. data-yt-id or data-tiktok-id
 * @param { LookupAttr.value } lookupAttr.value - required value of the attribute
 */
export function playActiveMediaTileOnLoad(
  sdk: ISdk,
  tile: Element,
  widgetSelector: HTMLElement,
  lookupAttr?: LookupAttr
) {
  if (isActiveTile(sdk, tile, widgetSelector, lookupAttr)) {
    void playMediaOnLoad(sdk)
  }
}

/**
 * Setup onload and onerror events for custom video source
 *
 * @param { Element } tile - the tile element
 * @param { HTMLElement } widgetSelector - the container of swiper element
 */
export function setupVideoEvents(sdk: ISdk, tile: Element, widgetSelector: HTMLElement) {
  const videoSourceElement = tile.querySelector<HTMLVideoElement>("video.video-content > source")
  if (videoSourceElement) {
    videoSourceElement.addEventListener("load", () => {
      playActiveMediaTileOnLoad(sdk, tile, widgetSelector)
    })
    videoSourceElement.addEventListener("error", () => {
      videoSourceElement.closest(".video-content-wrapper")?.classList.add("hidden")
      tile.querySelector(".video-fallback-content")?.classList.remove("hidden")
    })
  }
}
