/* eslint-disable cypress/no-unnecessary-waiting */
import { WIDGET_ID } from "./e2e"

Cypress.Commands.add("shouldExpandedTile", widgetType => {
  cy.getExpandedTile().should("exist")

  cy.wait(4000)

  cy.getFirstTile(widgetType).click()

  cy.wait(4000)

  cy.getExpandedTile().should("exist")

  cy.getExpandedTile().find(".image-element").should("exist").invoke("css", "visibility", "hidden")

  cy.wait(1000)

  cy.get(WIDGET_ID).shadow().find(".expanded-tile-overlay").should("exist").invoke("css", "background-color", "#000")
  cy.get("body").should("have.css", "overflow", "hidden")
})

Cypress.Commands.add("expandedTileExists", widgetType => {
  cy.wait(4000)

  cy.getExpandedTile().find(".ugc-tile[data-id='65e16a0b5d7e676caec68f03']").first().should("exist")
})

Cypress.Commands.add("getExpandedTile", () => {
  return cy.get(WIDGET_ID).shadow().find("expanded-tiles")
})
