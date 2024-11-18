describe("Should test the masonry", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });
    cy.visitWidget("masonry")
  })

  it("Should show tile", () => {
      cy.shouldShowTile("masonry");
  });

  it('Should expand tile', () => {
     cy.shouldExpandedTile("masonry");
  });

  it("Should display timephrase in the tile", () => {
    cy.getFirstTile().find(".tile-timephrase").should("exist").invoke("text").should("not.be.empty")
  })
})
