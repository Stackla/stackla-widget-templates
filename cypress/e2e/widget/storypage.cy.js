describe("Should test the direct-uploader", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", (err, runnable) => {
      return false
    })
    cy.visitWidget("storypage")
  })

  it("Should show tile", () => {
    cy.shouldShowTile("storypage")
  })

  it("Should expand tile", () => {
    cy.shouldExpandedTile("storypage")
  })

  it("Should load share icons", () => {
    cy.shouldLoadShareMenu()
  })
})
