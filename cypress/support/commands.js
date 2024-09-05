Cypress.Commands.add("visitWidget", widgetType => {
  cy.visit(`http://localhost:4002/preview?widgetType=${widgetType}`)
})

Cypress.Commands.add("getFirstTile", () => {
  return cy.get("ugc-widget-668ca52ada8fb").shadow().find(".ugc-tile").first()
})

Cypress.Commands.add("widgetTests", widgetType => {
  cy.visitWidget(widgetType)

  const widget = cy.get("ugc-widget-668ca52ada8fb")
  const shadowRoot = widget.shadow()

  it("should show ugc-tile", () => {
    widget.should("exist")
    shadowRoot.find(".ugc-tile").should("have.length", 100)
  })

  it("should expand tile when clicked", () => {
    cy.getFirstTile().click()

    const expandedTile = shadowRoot.get("expanded-tile")

    expandedTile.should("exist")

    const expandedTileShadow = expandedTile.shadow()

    expandedTileShadow.find("img").should("exist")

    expandedTileShadow.find(".stacklapopup-products-item-title").should("exist")

    expandedTileShadow.find(".stacklapopup-products-item-title").invoke("text").should("not.be.empty")
  })
})
