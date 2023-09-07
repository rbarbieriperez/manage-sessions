/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }


Cypress.Commands.add('login', (displayName: string, uid: string) => {
    cy.visit('localhost:3000');
    cy.viewport(320, 480);
    cy.viewport('iphone-5');
    sessionStorage.setItem('displayName', displayName);
    sessionStorage.setItem('uid', uid);
})

Cypress.Commands.add('navigateTo', (destination) => {
    cy.get('#root > main > header > div > div.MuiGrid2-root.MuiGrid2-direction-xs-row.MuiGrid2-grid-xs-2.css-bytlsb-MuiGrid2-root > button').click();
    cy.wait(1000);
    cy.contains(destination).click();
});