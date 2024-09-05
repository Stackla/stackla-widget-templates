describe("Should test the masonry", () => {
  it("Should pass default tests", () => {
    cy.widgetTests("masonry")
  })

  it("Should display timephrase in the tile", () => {
    cy.visitWidget("masonry")

    cy.getFirstTile().find(".tile-timephrase").should("exist").invoke("text").should("not.be.empty")
  })
})
