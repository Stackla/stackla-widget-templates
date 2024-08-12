import { createElement, createFragment } from "./jsx-html"

function Wrapper({ id, children }: { id: string; children?: unknown }) {
  return <div id={id}>{children}</div>
}

describe("JSX mapping", () => {
  it("supports direct usage", () => {
    const element = createElement("div", { id: "test", className: "panel right" })
    expect(element.outerHTML).toEqual('<div id="test" class="panel right"></div>')
  })

  it("handles elements", () => {
    const element = <div id="test" className="panel right" />
    expect(element.outerHTML).toEqual('<div id="test" class="panel right"></div>')
  })

  it("handles function wrappers", () => {
    const element = (
      <Wrapper id="test">
        <span>Hello World</span>
      </Wrapper>
    )
    expect(element.outerHTML).toEqual('<div id="test"><span>Hello World</span></div>')
  })

  it("skips undefined children", () => {
    const element = <div id="test">{undefined}</div>
    expect(element.outerHTML).toEqual('<div id="test"></div>')
  })

  it("registers event listeners", () => {
    let clicks = 0
    const element = <div id="test" onClick={() => clicks++} />
    expect(element.outerHTML).toEqual('<div id="test"></div>')

    element.click()
    expect(clicks).toEqual(1)
  })

  it("has correct event listener types", () => {
    const element = <div id="test" onClick={e => e.preventDefault()} />
    expect(element.outerHTML).toEqual('<div id="test"></div>')
  })

  it("binds styles correctly", () => {
    const element = <div id="test" style={{ color: "red", fontSize: "12px" }} />
    expect(element.outerHTML).toEqual('<div id="test" style="color: red; font-size: 12px;"></div>')
  })

  it("maps htmlFor to for attribute", () => {
    const element = <label htmlFor="test" />
    expect(element.outerHTML).toEqual('<label for="test"></label>')
  })

  it("creates fragments", () => {
    const fragment = (
      <>
        <span>Hello</span>
        <span>World</span>
      </>
    )
    const html = Array.from(fragment.children)
      .map(node => node.outerHTML)
      .join("")
    expect(html).toEqual("<span>Hello</span><span>World</span>")
  })
})
