describe("Should test the nightfall template", () => {
  it("Should pass default tests", () => {
    cy.widgetTests("nightfall")
  })

  it("Should display timephrase in the tile", () => {
    cy.visitWidget("nightfall")

    cy.getFirstTile().find(".tile-timephrase").should("exist").invoke("text").should("not.be.empty")
  })

  it("Shoud display caption in the tile", () => {
    cy.visitWidget("nightfall")

    cy.getFirstTile().find(".tile-caption").should("exist").invoke("text").should("not.be.empty")
  })
})
