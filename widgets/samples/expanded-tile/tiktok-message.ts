type TiktokMessageType = "play" | "pause" | "mute" | "unMute" | "seekTo"

/**
 * Post tiktok messages to play a video/audio
 *
 * @param { Window } frameWindow - tiktok frame contentWindow
 */
export function playTiktokVideo(frameWindow: Window) {
  postTiktokMessage(frameWindow, "unMute")
  postTiktokMessage(frameWindow, "play")
}

/**
 * Post tiktok messages to pause a video/audio and reset the current video progress
 *
 * @param { Window } frameWindow - tiktok frame contentWindow
 */
export function pauseTiktokVideo(frameWindow: Window) {
  postTiktokMessage(frameWindow, "mute")
  postTiktokMessage(frameWindow, "pause")
  postTiktokMessage(frameWindow, "seekTo", 0)
}

export function muteTiktokVideo(frameWindow: Window) {
  postTiktokMessage(frameWindow, "mute")
}

export function unMuteTiktokVideo(frameWindow: Window) {
  postTiktokMessage(frameWindow, "unMute")
}

/**
 *
 * @param { Window } frameWindow - tiktok frame contentWindow
 * @param { TiktokMessageType } type - message type to be posted ("play" | "pause" | "mute" | "unMute" | "seekTo")
 * @param { number } value - position of media progress. 0 to reset progress
 */
export function postTiktokMessage(frameWindow: Window, type: TiktokMessageType, value?: number) {
  frameWindow.postMessage({ type, value, "x-tiktok-player": true }, "https://www.tiktok.com")

  // Fallback logic to handle when TikTok player is not ready yet
  window.addEventListener("message", event => {
    if (event.data.type === "onPlayerReady" && event.data["x-tiktok-player"]) {
      frameWindow.postMessage({ type, value, "x-tiktok-player": true }, "https://www.tiktok.com")
    }
  })
}
