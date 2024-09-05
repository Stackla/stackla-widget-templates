describe("Server should initiate, and autoload css and js files", () => {
  it("should load css and js files", () => {
    const jsEndpoint = "http://127.0.0.1:4002/autoload?widget=carousel&resource=js&selector=123"
    cy.request(jsEndpoint).its("headers").its("content-type").should("include", "text/javascript")
  })

  it("should load css and js files", () => {
    const endpoint = "http://127.0.0.1:4002/autoload?widget=carousel&resource=css&selector=123"
    cy.request(endpoint).its("headers").its("content-type").should("include", "text/css")
  })
})
