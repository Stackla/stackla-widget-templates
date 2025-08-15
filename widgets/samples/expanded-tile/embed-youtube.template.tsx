import { createElement } from "@stackla/widget-utils"

export type EmbedYoutubeProps = {
  tileId: string
  videoId: string
  onLoad?: (event: Event) => void
  swiperId: string
}

export function EmbedYoutube({ tileId, videoId, onLoad, swiperId }: EmbedYoutubeProps) {
  const contentElement = loadYoutubeIframeContent(tileId, videoId, swiperId)

  return (
    <iframe
      loading="lazy"
      id={`yt-frame-${tileId}-${videoId}`}
      tileid={tileId}
      class="video-content"
      frameborder="0"
      enablejsapi="1"
      onload={onLoad}
      srcdoc={contentElement.innerHTML}></iframe>
  )
}

function loadYoutubeIframeContent(tileId: string, videoId: string, swiperId: string) {
  const scriptId = `yt-script-${tileId}-${videoId}`
  const playerId = `yt-player-${tileId}-${videoId}`
  return (
    <html>
      <head>
        <script id={scriptId} src="https://www.youtube.com/iframe_api"></script>
        <script>{loadYoutubePlayerAPI(playerId, videoId, swiperId)}</script>
        <style>{`
          body {
            margin: 0;
            height: 100dvh;
            scrollbar-width: none;
            overflow: hidden;
            iframe {
              height: 100dvh;
              width: 100%;
              overflow: hidden;
              scrollbar-width: none;
            }
          }
        `}</style>
      </head>
      <body>
        <div id={playerId}></div>
      </body>
    </html>
  )
}

export function loadYoutubePlayerAPI(playerId: string, videoId: string, swiperId: string) {
  return `
  let player;
  let swiper = parent.window.ugc.swiperContainer["${swiperId}"];
  const instance = swiper?.instance;

  function onPlayerStateChange(event) {
    instance?.autoplay?.stop();
    if (event.data === YT.PlayerState.ENDED) {
      instance?.autoplay?.start();
      instance?.slideNext();
    }
  }

  function loadPlayer(playDefault = false) {
    player = new YT.Player("${playerId}", {
      width: "100%",
      height: "100%",
      videoId: "${videoId}",
      playerVars: {
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        enablejsapi: 1,
        playsinline: 1,
      },
      events: {
        onReady: playDefault ? play : pause,
        onStateChange: onPlayerStateChange,
        onError: errorHandler
      }
    });
  }

  function onYouTubeIframeAPIReady() {
    loadPlayer();
  }

  function errorHandler(e) {
    player?.getIframe().dispatchEvent(new CustomEvent("yt-video-error", { detail: e }));
  }

  function pause() {
    if (player && player.pauseVideo) {
      player.pauseVideo();
    }
  }

  function play() {
    if (player && player.playVideo) {
      player.playVideo();
    }
  }

  function observeVisibility() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          play();
        } else {
          pause();
          instance?.autoplay?.start();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(document.body);
  }

  window.onYouTubeIframeAPIReady = () => {
    loadPlayer(false);
    observeVisibility();
  };
  `
}
