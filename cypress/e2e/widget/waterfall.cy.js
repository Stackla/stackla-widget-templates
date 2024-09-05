describe("Should test the waterfall", () => {
  it("Should pass default tests", () => {
    cy.widgetTests("waterfall")
  })

  it("Should display timephrase in the tile", () => {
    cy.visitWidget("waterfall")

    cy.getFirstTile().find(".tile-timephrase").should("exist").invoke("text").should("not.be.empty")
  })

  it("Shoud display caption in the tile", () => {
    cy.visitWidget("waterfall")

    cy.getFirstTile().find(".tile-caption").should("exist").invoke("text").should("not.be.empty")
  })
})
