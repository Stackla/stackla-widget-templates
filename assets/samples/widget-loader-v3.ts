import { embed } from "@stackla/widget-utils"

const widget = document.getElementById("stackla-widget")

if (!widget) {
  throw new Error("Could not find widget element")
}

embed({
  widgetId: "6787d01c10b5c",
  root: widget,
  environment: "staging",
  dataProperties: {}
})
