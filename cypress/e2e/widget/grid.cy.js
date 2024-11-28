const WIDGET_TYPE = "grid"

describe("Should test the grid", () => {
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

  it("Should load share icons", () => {
    cy.shouldLoadShareMenu()
  })
})
