const propsToCompare = [
  // Box Model & Layout
  "display",
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "margin",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "padding",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "width",
  "height",
  "min-width",
  "max-width",
  "min-height",
  "max-height",
  "box-sizing",
  "overflow",
  "overflow-x",
  "overflow-y",
  "z-index",
  "float",
  "clear",

  // Typography
  "font-family",
  "font-size",
  "font-style",
  "font-weight",
  "line-height",
  "letter-spacing",
  "word-spacing",
  "text-align",
  "text-decoration",
  "text-transform",
  "white-space",
  "vertical-align",
  "direction",

  // Colors & Background
  "color",
  "background-color",
  "background-image",
  "background-size",
  "background-position",
  "background-repeat",
  "background-attachment",
  "opacity",

  // Borders & Outline
  "border",
  "border-width",
  "border-style",
  "border-color",
  "border-top",
  "border-right",
  "border-bottom",
  "border-left",
  "border-radius",
  "outline",
  "outline-width",
  "outline-style",
  "outline-color",

  // Box Shadow & Filters
  "box-shadow",
  "filter",

  // Flexbox
  "flex",
  "flex-grow",
  "flex-shrink",
  "flex-basis",
  "flex-direction",
  "flex-wrap",
  "justify-content",
  "align-items",
  "align-content",
  "align-self",
  "order",

  // Grid
  "grid-template-columns",
  "grid-template-rows",
  "grid-column",
  "grid-row",
  "grid-area",
  "grid-gap",
  "gap",
  "row-gap",
  "column-gap",
  "place-items",
  "place-content",
  "place-self",

  // Transitions & Animations
  "transition",
  "transition-property",
  "transition-duration",
  "transition-timing-function",
  "transition-delay",
  "animation",
  "animation-name",
  "animation-duration",
  "animation-timing-function",
  "animation-delay",
  "animation-iteration-count",
  "animation-direction",
  "animation-fill-mode",
  "animation-play-state",

  // Visibility & Display
  "visibility",
  "pointer-events",
  "cursor"
]

export const getPropsFromComputedStyle = el => {
  const computedStyle = window.getComputedStyle(el)
  const propsObj = {}
  propsToCompare.forEach(prop => {
    propsObj[prop] = computedStyle.getPropertyValue(prop)
  })
  return propsObj
}
