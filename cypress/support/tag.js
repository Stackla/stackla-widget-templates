/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable cypress/no-unnecessary-waiting */

Cypress.Commands.add("shouldLoadTags", widgetType => {
  cy.getFirstTile(widgetType).should("exist").click({ force: true })

  cy.getExpandedTile().find("tile-tags").first().should("be.visible")

  cy.getExpandedTile().find("tile-tags").first().should("exist").click({ force: true })

  cy.getExpandedTile().find(".swiper-tags-button-next").first().should("exist").click({ force: true })

  cy.getExpandedTile().find(".swiper-tags-button-prev").first().should("exist").click({ force: true })
})
