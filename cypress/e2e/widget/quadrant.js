describe("Should test the quadrant", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", (err, runnable) => {
      return false
    })
    cy.visitWidget("quadrant")
  })

  it("Should show tile", () => {
    cy.shouldShowTile("quadrant")
  })

  it("Should expand tile", () => {
    cy.shouldExpandedTile("quadrant")
  })

  it("Should display timephrase in the tile", () => {
    cy.getFirstTile().find(".tile-timephrase").should("exist").invoke("text").should("not.be.empty")
  })

  it("Should load share icons", () => {
    cy.shouldLoadShareMenu()
  })
})
