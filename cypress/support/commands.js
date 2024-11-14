Cypress.Commands.add("visitWidget", widgetType => {
  cy.visit(`http://localhost:4002/preview?widgetType=${widgetType}`)
})

Cypress.Commands.add("getFirstTile", () => {
  return cy.get("ugc-widget-668ca52ada8fb").shadow().find(".ugc-tile").first()
})

Cypress.Commands.add("expandedTileTest", expandedTile => {
  expandedTile.should("exist")

  const expandedTileShadow = expandedTile.shadow()

  expandedTileShadow.find("img").should("exist")

  expandedTileShadow.find(".stacklapopup-products-item-title").should("exist")

  expandedTileShadow.find(".stacklapopup-products-item-title").invoke("text").should("not.be.empty")
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

    cy.expandedTileTest(expandedTile)
  })

  it("should display share menu in expanded and handle share menu events", () => {
    cy.getFirstTile().click()

    const expandedTile = shadowRoot.get("expanded-tile")
    cy.expandedTileTest(expandedTile)

    const shareButton = expandedTile.find(".panel-right .share-button")
    shareButton.should("exist")
    shareButton.click()

    const shareMenuWrapper = shareButton.find(".share-socials-popup-wrapper")
    shareMenuWrapper.should("exist")

    const urlCopyElement = shareMenuWrapper.find(".url-copy")
    urlCopyElement.should("exist")
    urlCopyElement.find(".url-controls .copy-button").should(exist).click()
    urlCopyElement.find(".copy-button").contains("Copied")

    shareMenuWrapper.find(".exit").should("exist").click()

    shareButton.find(".share-socials-popup-wrapper").should("not.exist")
  })

  it("should find the content inside the tile-content element", () => {
    cy.getFirstTile().click()

    const expandedTile = shadowRoot.get("expanded-tile")
    cy.expandedTileTest(expandedTile)

    const tileContent = expandedTile.find("tile-content")

    tileContent.should("exist")

    const tileContentShadow = tileContent.shadow()

    tileContentShadow.find(".tile-content-wrapper").should("exist")

    tileContentShadow.find(".caption-paragraph").invoke("text").should("not.be.empty")
  })
})
