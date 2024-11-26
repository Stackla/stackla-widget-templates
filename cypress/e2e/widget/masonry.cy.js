const WIDGET_TYPE = "masonry"

describe("Should test the masonry", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", () => {
      return false
    })
    cy.visitWidget(WIDGET_TYPE)
    cy.before()
  })

  it("Should show widget contents", () => {
    cy.shouldShowWidgetContents(WIDGET_TYPE)
  })

  it("Should expand tile", () => {
    cy.shouldExpandedTile(WIDGET_TYPE)
  })

  it("Should display timephrase in the tile", () => {
    cy.getFirstTile().find(".tile-timephrase").should("exist").invoke("text").should("not.be.empty")
  })

  it("Should load share icons", () => {
    cy.shouldLoadShareMenu()
  })
})
