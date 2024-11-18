describe("Should test the grid", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });
    cy.visitWidget("grid")
  })
  
  it("Should show tile", () => {
      cy.shouldShowTile("grid");
  });

  it('Should expand tile', () => {
     cy.shouldExpandedTile("grid");
  });
})
