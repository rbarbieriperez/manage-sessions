const addSession = require('../fixtures/add-session.json');

describe('Navigate to Add Session screen', () => {

  beforeEach  (() => {
    cy.login('Rodrigo Barbieri', 'mtPEs0AkdjfvnOq43TX7LE4Hn0n2');
    cy.wait(3000);
  });

  /* it('the user logs in and sees all the inputs', () => {
    cy.get('span').should('contain', 'Clinicas');
    cy.get('span').should('contain', 'Pacientes');
    cy.get('textarea').should('have.attr', 'placeholder', "Observaciones de la sesión...");
    cy.get('h6').should('contain', '0/500');
    cy.get('span').should('contain', 'Ver pacientes con sesiones registradas el dia de hoy');
  });

  it('the submit button is disabled by default', () => {
    cy.get('button').should('be.disabled');
  }); */

  it('the user completes all the required data and submit session', () => {
    cy.get('div[data-testid="select-custom"] div[role="button"]').then(els => els.slice(0, 1)).click();
    /* cy.get('span').should('contain', 'Pacientes');
    cy.get('textarea').should('have.attr', 'placeholder', "Observaciones de la sesión...");
    cy.get('h6').should('contain', '0/500');
    cy.get('span').should('contain', 'Ver pacientes con sesiones registradas el dia de hoy');
  }); */
  });

});