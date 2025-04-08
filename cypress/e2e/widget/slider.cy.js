const WIDGET_TYPE = "slider"

describe("Should test the slider", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", () => {
      return false
    })
    cy.visitWidget(WIDGET_TYPE)
    cy.before()
  })

  it("Should expand tile", () => {
    cy.shouldExpandedTile(WIDGET_TYPE)
  })

  it("Should load share icons", () => {
    cy.shouldLoadShareMenu(WIDGET_TYPE)
  })

  it("Should load tags", () => {
    cy.shouldLoadTags(WIDGET_TYPE)
  })
})
