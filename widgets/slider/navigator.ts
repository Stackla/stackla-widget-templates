import { EVENT_LOAD_MORE, Features, ISdk } from "@stackla/widget-utils"
import { getRenderMode, getSliderElement, getTileContainerElement } from "./utils"
import { initObservers } from "./observers"

type SwiperDirection = "none" | "left" | "right" | "up" | "down"

declare const sdk: ISdk

export default function (_settings: Features["tileSizeSettings"], observers: ReturnType<typeof initObservers>) {
  const sliderElement = getSliderElement()
  const tilesContainerElement = getTileContainerElement()
  const scrollHistory: Array<number> = []

  if (!sliderElement) {
    throw new Error("Slider Element not found")
  }

  const scrollerHandler = scroller(sliderElement)

  if (!tilesContainerElement) {
    throw new Error("Slider Tiles Container not found")
  }

  const swipeDetectHandler = swipeDetect(tilesContainerElement, direction => {
    if (direction === "up") {
      scrollDown()
    } else if (direction === "down") {
      scrollUp()
    }
  })

  const mobileAndTabletCheck = function () {
    let check = false
    ;(function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
          a
        ) ||
        // eslint-disable-next-line no-useless-escape
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true
    })(navigator.userAgent || navigator.vendor)
    return check
  }

  if (!tilesContainerElement) {
    throw new Error("Slider Tiles Container not found")
  }

  if (!sliderElement) {
    throw new Error("Slider Element not found")
  }

  const screenResizeObserver = new ResizeObserver(() =>
    requestAnimationFrame(() => {
      scrollerHandler.setPage(1)
      tilesContainerElement.scrollTop = 0
      if (getRenderMode(sliderElement) === "desktop") {
        swipeDetectHandler.unregister()
        scrollerHandler.register()
      } else {
        swipeDetectHandler.register()

        if (!mobileAndTabletCheck()) {
          scrollerHandler.register()
        }
      }
    })
  )

  screenResizeObserver.observe(tilesContainerElement)

  function scroller(el: HTMLElement) {
    const sliderScrollUpButton = el.querySelector<HTMLElement>("#scroll-up")
    const sliderScrollDownButton = el.querySelector<HTMLElement>("#scroll-down")
    let page = 1

    if (!sliderScrollUpButton) {
      throw new Error("Slider Tiles Scroll Up Button not found")
    }

    if (!sliderScrollDownButton) {
      throw new Error("Slider Tiles Scroll Down Button not found")
    }

    function scrollUpEventHandler(event: Event) {
      event.preventDefault()
      event.stopImmediatePropagation()
      event.stopPropagation()

      if (!tilesContainerElement) {
        throw new Error("Tiles Container Element not found")
      }

      if (tilesContainerElement.scrollTop > 0) {
        scrollUp()
      }
    }

    function scrollDownEventHandler(event: Event) {
      event.preventDefault()
      event.stopImmediatePropagation()
      event.stopPropagation()
      scrollDown()
    }

    function register() {
      toggleScrollUp("hidden")
      toggleScrollDown("visible")
      sliderScrollUpButton!.addEventListener("click", scrollUpEventHandler)
      sliderScrollDownButton!.addEventListener("click", scrollDownEventHandler)
    }

    function unregister() {
      toggleScrollUp("hidden")
      toggleScrollDown("hidden")
      sliderScrollUpButton!.removeEventListener("click", scrollUpEventHandler)
      sliderScrollDownButton!.removeEventListener("click", scrollDownEventHandler)
    }

    function toggleScrollUp(visibility: string) {
      sliderScrollUpButton!.style.visibility = visibility
    }

    function toggleScrollDown(visibility: string) {
      sliderScrollDownButton!.style.visibility = visibility
    }

    function setPage(value: number) {
      page = value
    }

    function incrementPage() {
      setPage(page + 1)

      const hasMoreTiles = sdk.hasMoreTiles()

      if (!tilesContainerElement) {
        throw new Error("Tiles Container Element not found")
      }

      if (
        tilesContainerElement.scrollTop + tilesContainerElement.clientHeight + 200 >=
        tilesContainerElement.scrollHeight
      ) {
        if (hasMoreTiles) {
          sdk.triggerEvent(EVENT_LOAD_MORE)
        } else {
          toggleScrollDown("hidden")
        }
      }
    }

    function decrementPage() {
      setPage(page - 1)

      if (page === 1) {
        toggleScrollUp("hidden")
      }

      toggleScrollDown("visible")
    }

    return {
      register,
      unregister,
      toggleScrollUp,
      toggleScrollDown,
      page,
      incrementPage,
      decrementPage,
      setPage
    }
  }

  function swipeDetect(el: HTMLElement, callback: (swipeDirection: SwiperDirection) => void) {
    const allowedTime = 1500,
      threshold = 150,
      restraint = 100
    let startX: number, startY: number, startTime: number

    function registerTouchStart(event: TouchEvent) {
      requestAnimationFrame(() => {
        const touchObject = event.changedTouches[0]
        startX = touchObject.pageX
        startY = touchObject.pageY
        startTime = new Date().getTime()
        event.preventDefault()
      })
    }

    function registerTouchEnd(event: TouchEvent) {
      requestAnimationFrame(() => {
        const touchObject = event.changedTouches[0]
        const distX = touchObject.pageX - startX
        const distY = touchObject.pageY - startY
        const elapsedTime = new Date().getTime() - startTime

        if (elapsedTime <= allowedTime) {
          if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
            callback(distX < 0 ? "left" : "right")
          } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
            callback(distY < 0 ? "up" : "down")
          }
        }
        event.preventDefault()
      })
    }

    return {
      register: () => {
        el.addEventListener("touchstart", registerTouchStart, false)
        el.addEventListener("touchmove", (event: TouchEvent) => event.preventDefault())
        el.addEventListener("touchend", registerTouchEnd)
      },

      unregister: () => {
        el.removeEventListener("touchstart", registerTouchStart, false)
        el.removeEventListener("touchmove", (event: TouchEvent) => event.preventDefault())
        el.removeEventListener("touchend", registerTouchEnd)
      }
    }
  }

  function scrollUp() {
    scrollerHandler.toggleScrollDown("visible")
    scrollerHandler.decrementPage()

    tilesContainerElement?.scrollTo({
      top: scrollHistory.pop(),
      left: 0
    })

    setTimeout(() => {
      observers?.cleanupStyles()
    }, 500)
  }

  function scrollDown() {
    scrollerHandler.toggleScrollUp("visible")
    scrollerHandler.incrementPage()

    tilesContainerElement?.scrollBy({
      top: getBlockHeight(),
      left: 0
    })
  }

  function getNextScrollPosition() {
    scrollHistory.push(tilesContainerElement?.scrollTop ?? 0)
    return observers?.getNextTilePosition()
  }

  function getBlockHeight() {
    return getNextScrollPosition()
  }
}
