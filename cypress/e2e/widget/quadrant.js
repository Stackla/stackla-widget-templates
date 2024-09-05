describe("Should test the quadrant", () => {
  it("Should pass default tests", () => {
    cy.widgetTests("quadrant")
  })

  it("Should display timephrase in the tile", () => {
    cy.visitWidget("quadrant")

    cy.getFirstTile().find(".tile-timephrase").should("exist").invoke("text").should("not.be.empty")
  })
})
