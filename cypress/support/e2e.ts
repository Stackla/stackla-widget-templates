// eslint-disable-next-line
import { addCompareSnapshotCommand } from "cypress-visual-regression/dist/command"

const WIDGET_ID = "ugc-widget-668ca52ada8fb"

addCompareSnapshotCommand({
  capture: "viewport",
  errorThreshold: 0.08
})

Cypress.Commands.add("visitWidget", widgetType => {
  cy.intercept(
    "POST",
    "http://localhost:4002/development/widgets/668ca52ada8fb/draft?wid=668ca52ada8fb&limit=25&page=1"
  ).as("getWidget")

  cy.intercept(
    "GET",
    "http://localhost:4002/development/widgets/668ca52ada8fb/tiles?wid=668ca52ada8fb&limit=25&page=1"
  ).as("getTiles")

  cy.visit(`http://localhost:4002/preview?widgetType=${widgetType}`)

  cy.wait("@getWidget")

  cy.get(WIDGET_ID).shadow().find(".ugc-tile", { timeout: 10000 }).first().should("be.visible")
})

Cypress.Commands.add("getFirstTile", () => {
  return cy.get(WIDGET_ID).shadow().find(".ugc-tile").first()
})

Cypress.Commands.add("shouldShowTile", widgetType => {
  cy.getFirstTile().should("exist")
  cy.getFirstTile().click()
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(5000)
  cy.snapshot(`${widgetType}-tile`)
})

Cypress.Commands.add("snapshot", (name: string) => {
  cy.compareSnapshot(name)
})

Cypress.Commands.add("getProductComponent", expandedTile => {
  return expandedTile.shadow().find("ugc-products")
})

Cypress.Commands.add("shouldExpandedTile", () => {
  cy.get(WIDGET_ID).shadow().find("expanded-tiles").should("exist")

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(4000)

  cy.getFirstTile().click()

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(4000)

  cy.get(WIDGET_ID).shadow().find("expanded-tiles").shadow().find("img").should("exist")
})

// TODO - FIX Share Menu
// Cypress.Commands.add("shouldLoadShareMenu", widgetType => {
//   const expandedTileShadow = cy.getWidgetShadow().find("expanded-tiles").shadow()

//   const shareButton = expandedTileShadow.find(".share-button")
//   shareButton.should("exist")
//   shareButton.click();

//   const shareMenuWrapper = shareButton.find(".share-socials-popup-wrapper")
//   shareMenuWrapper.should("exist")

//   const urlCopyElement = shareMenuWrapper.find(".url-copy")
//   urlCopyElement.should("exist")
//   urlCopyElement.find(".url-controls .copy-button").should('exist').click()
//   urlCopyElement.find(".copy-button").contains("Copied")

//   shareMenuWrapper.find(".exit").should("exist").click()

//   shareButton.find(".share-socials-popup-wrapper").should("not.exist")
// });
