import { Features } from "@stackla/widget-utils"
import { getRenderMode, getSliderElement, getTileContainerElement, getTileElements } from "./utils"

type SliderObserverProps = {
  settings: Features["tileSizeSettings"]
  resizeCb?: () => void
  intersectionCb?: () => void
}

export function initObservers({ resizeCb, intersectionCb }: SliderObserverProps) {
  const animationClasses = { up: "tile-animate-up", down: "tile-animate-down" }
  const partiallyVisibleClass = "partially-visible"
  const tilesContainerElement = getTileContainerElement()
  let previousPosition = tilesContainerElement.scrollTop
  const latestEntries: IntersectionObserverEntry[] = []

  const resizeObserver = new ResizeObserver(() =>
    requestAnimationFrame(() => {
      resizeCb?.()
    })
  )

  const tilesIntersectionObserver = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        const htmlElement = entry.target as HTMLElement
        enableAnimation(htmlElement)
        if (entry.isIntersecting) {
          if (entry.target.classList.contains(partiallyVisibleClass)) {
            if (entry.intersectionRatio === 1) {
              entry.target.classList.remove(partiallyVisibleClass)
              return
            }
          }
        }

        latestEntries.push(entry)

        entry.target.classList.add(partiallyVisibleClass)
      })
      intersectionCb?.()
      previousPosition = tilesContainerElement.scrollTop
    },
    { root: tilesContainerElement, rootMargin: "0px", threshold: [1] }
  )

  getTileElements()[0].classList.add(animationClasses.up)

  function getNextTilePosition() {
    if (getTileElements().length === 0) {
      return window.innerHeight * 0.4
    }

    const classesAsArray = Array.from(getTileElements()[0].classList)

    if (classesAsArray.includes("pattern-horizontal") || classesAsArray.includes("pattern-horizontal-reversed")) {
      return getTileElements()[0].getBoundingClientRect().width
    }

    return getTileElements()[0].getBoundingClientRect().height * 2
  }

  function cleanupStyles() {
    latestEntries.forEach(entry => Object.values(animationClasses).forEach(item => entry.target.classList.remove(item)))
  }

  function enableAnimation(element: HTMLElement) {
    if (previousPosition === tilesContainerElement.scrollTop) {
      return
    }

    const animationClass =
      previousPosition < tilesContainerElement.scrollTop ? animationClasses.up : animationClasses.down

    Object.values(animationClasses).forEach(item => element.classList.remove(item))

    if (getRenderMode(getSliderElement()) !== "mobile" || element.classList.contains(partiallyVisibleClass)) {
      element.classList.add(animationClass)
    }
  }

  function configResizeObserverTargets() {
    resizeObserver.observe(tilesContainerElement)
  }

  function configTileIntersectionTargets() {
    getTileElements().forEach(tile => tilesIntersectionObserver.observe(tile))
  }

  function disconnect() {
    tilesIntersectionObserver.disconnect()
    resizeObserver.disconnect()
  }

  return { configResizeObserverTargets, configTileIntersectionTargets, getNextTilePosition, cleanupStyles, disconnect }
}
