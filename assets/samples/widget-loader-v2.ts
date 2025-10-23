import { embed } from "@stackla/widget-utils"

const widget = document.getElementById("stackla-widget")

if (!widget) {
  throw new Error("Could not find widget element")
}

embed({
  widgetId: "63bb5fa51729c",
  root: widget,
  environment: "staging",
  dataProperties: {}
})
