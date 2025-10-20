import { Window } from "happy-dom"

export default () => {
  const window = new Window({ url: "https://localhost:4003" })
  const document = window.document
  document.body.innerHTML += '<div id="ugc-widget" data-wid="62eb2697a8db6"></div>'

  // @ts-expect-error happy-dom types do not fully align with DOM types
  global.window = window
  // @ts-expect-error happy-dom types do not fully align with DOM types
  global.document = document
}
