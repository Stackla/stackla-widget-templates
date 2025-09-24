// Disabling lint for this file because it is a test helper file particular to Cypress and we don't want to enforce linting rules on it
/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */

import "./expanded-tile"
import "./share-menu"
import "./tag"

import { addCompareSnapshotCommand } from "cypress-visual-regression/dist/command"

export const WIDGET_ID = "ugc-widget-668ca52ada8fb"

function getUgcTileSelectorByWidgetType(widgetType) {
  switch (widgetType) {
    case "quadrant":
      return ".ugc-tile.processed"
    default:
      return ".ugc-tile"
  }
}

addCompareSnapshotCommand({
  capture: "viewport",
  errorThreshold: 0.1
})

Cypress.Commands.add("before", () => {})

Cypress.Commands.add("waitAndDisableImages", () => {
  cy.wait(8000)

  cy.window().then(window => {
    const tiles = window.ugc.getWidgetBySelector().sdk.querySelectorAll(".tile")
    tiles.forEach(tile => {
      tile.style = ""
      tile.style.border = "1px solid red"
    })

    const images = window.ugc.getWidgetBySelector().sdk.querySelectorAll(".ugc-tile img")
    images.forEach(image => {
      image.style.visibility = "hidden"
    })
  })
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

  cy.get(WIDGET_ID).shadow().find(getUgcTileSelectorByWidgetType(widgetType), { timeout: 10000 }).first()

  cy.waitAndDisableImages()
})

Cypress.Commands.add("widgetSnapshot", widgetType => {
  cy.snapshot(`${widgetType}-widget`)
})

Cypress.Commands.add("getFirstTile", widgetType => {
  return cy.get(WIDGET_ID).shadow().find(getUgcTileSelectorByWidgetType(widgetType)).first()
})

Cypress.Commands.add("snapshot", name => {
  cy.compareSnapshot(name)
})

Cypress.Commands.add("getProductComponent", expandedTile => {
  return expandedTile.shadow().find("ugc-products")
})
