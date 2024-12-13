import { Features } from "packages/widget-utils"
import { getRenderMode, getSliderElement, getTileContainerElement, getTileElements } from "./utils"
import { markColumns } from "./slider-design"

export function initObservers(settings: Features["tileSizeSettings"]) {
  const animationClasses = { up: "tile-animate-up", down: "tile-animate-down" }
  const partiallyVisibleClass = "partially-visible"
  const tilesContainerElement = getTileContainerElement()
  const sliderInlineElement = getSliderElement()
  let previousPosition = tilesContainerElement.scrollTop

  const resizeObserver = new ResizeObserver(() =>
    requestAnimationFrame(() => {
      if (getRenderMode(sliderInlineElement) === "desktop") {
        markColumns(settings)
      } else {
        tilesIntersectionObserver.disconnect()
      }
    })
  )

  const tilesIntersectionObserver = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      filterRecentEntries(entries).forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains(partiallyVisibleClass)) {
            if (entry.intersectionRatio === 1) {
              if (!supportsAnimationTimeline()) {
                enableAnimation(entry.target)
              }
              entry.target.classList.remove(partiallyVisibleClass)
            }
          }
        } else if (!entry.target.classList.contains(partiallyVisibleClass)) {
          entry.target.classList.add(partiallyVisibleClass)
        }
      })
      previousPosition = tilesContainerElement.scrollTop
    },
    { root: tilesContainerElement, rootMargin: "0px", threshold: 1 }
  )

  configObserverTargets()

  function supportsAnimationTimeline() {
    return CSS.supports("(animation-timeline: scroll()) and (animation-range: 0% 100%)")
  }

  function filterRecentEntries(entries: IntersectionObserverEntry[]) {
    const uniqueEntries = []

    for (const entry of entries) {
      const existingIndex = uniqueEntries.findIndex(uniqEntry => uniqEntry.target.isSameNode(entry.target))
      if (existingIndex >= 0) {
        uniqueEntries.splice(existingIndex, 1, entry)
      } else {
        uniqueEntries.push(entry)
      }
    }

    return uniqueEntries
  }

  function enableAnimation(element: Element) {
    if (previousPosition === tilesContainerElement.scrollTop) {
      return
    }

    const animationClass =
      previousPosition < tilesContainerElement.scrollTop ? animationClasses.up : animationClasses.down

    const removeClass = animationClass === animationClasses.up ? animationClasses.down : animationClasses.up

    element.classList.remove(removeClass)

    if (!element.classList.contains(animationClass)) {
      element.classList.add(animationClass)
    }
  }

  function configObserverTargets() {
    configTileIntersectionTargets()
    resizeObserver.observe(tilesContainerElement)
  }

  function configTileIntersectionTargets() {
    if (getRenderMode(sliderInlineElement) === "desktop") {
      getTileElements().forEach(tile => tilesIntersectionObserver.observe(tile))
    }
  }

  function disconnect() {
    tilesIntersectionObserver.disconnect()
    resizeObserver.disconnect()
  }

  return { configObserverTargets, configTileIntersectionTargets, disconnect }
}
