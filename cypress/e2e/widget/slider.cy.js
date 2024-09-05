describe("Should test the slider", () => {
  it("Should pass default tests", () => {
    cy.widgetTests("slider")
  })

  it("Should display timephrase in the tile", () => {
    cy.visitWidget("slider")

    cy.getFirstTile().find(".tile-timephrase").should("exist").invoke("text").should("not.be.empty")
  })
})
