describe("Should test the carousel", () => {
  it("Should pass default tests", () => {
    cy.widgetTests("carousel")
  })

  it("Should display timephrase in the tile", () => {
    cy.visitWidget("carousel")

    cy.getFirstTile().find(".tile-timephrase").should("exist").invoke("text").should("not.be.empty")
  })
})
