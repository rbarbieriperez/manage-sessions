describe('Navigate to Add Session screen', () => {

  beforeEach  (() => {
      cy.login('Rodrigo Barbieri', 'mtPEs0AkdjfvnOq43TX7LE4Hn0n2');
      cy.wait(3000);
  });

  it('the user logs in and sees all the inputs', () => {
      cy.get('span').should('contain', 'Clinicas');
      cy.get('span').should('contain', 'Pacientes');
      cy.get('textarea').should('have.attr', 'placeholder', "Observaciones de la sesión...");
      cy.get('h6').should('contain', '0/500');
      cy.get('span').should('contain', 'Ver pacientes con sesiones registradas el dia de hoy');
  });

  it('the submit button is disabled by default', () => {
      cy.get('button').should('be.disabled');
  }); 

  it('the user completes all the required data and submit session', () => {
      cy.get('div[data-testid="select-custom"] div[role="button"]').then(els => els.slice(0, 1)).click();
      cy.get('#menu- > div.MuiPaper-root.MuiMenu-paper.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation8.MuiPopover-paper.css-3dzjca-MuiPaper-root-MuiPopover-paper-MuiMenu-paper > ul > li:nth-child(1)').click();
      cy.get('div[data-testid="select-custom"] div[role="button"]').then(els => els.slice(1)).click();
      cy.get('#menu- > div.MuiPaper-root.MuiMenu-paper.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation8.MuiPopover-paper.css-3dzjca-MuiPaper-root-MuiPopover-paper-MuiMenu-paper > ul > li:nth-child(1)').click();
      cy.get('#root > main > div > div:nth-child(4) > div > div textarea[id=":r5:"]').type('Sesions obs');
      cy.get('#root > main > div > div.MuiGrid2-root.MuiGrid2-direction-xs-row.MuiGrid2-grid-xs-12.css-1ai9w05-MuiGrid2-root > button').should('not.be.disabled');
      cy.get('#root > main > div > div.MuiGrid2-root.MuiGrid2-direction-xs-row.MuiGrid2-grid-xs-12.css-1ai9w05-MuiGrid2-root > button').click();
      cy.get('#root > main > div.MuiStack-root.css-186dh1l-MuiStack-root > div > div.MuiAlert-message.css-1pxa9xg-MuiAlert-message').should('be.visible');
  });

  it('the user opens the "patients with sessions registered today"', () => {
    cy.get('#root > main > div > div.MuiGrid2-root.MuiGrid2-direction-xs-row.MuiGrid2-grid-xs-10.css-10sf5c1-MuiGrid2-root > span').click();
    cy.get('body > div.MuiDialog-root.MuiModal-root.css-zw3mfo-MuiModal-root-MuiDialog-root > div.MuiDialog-container.MuiDialog-scrollPaper.css-hz1bth-MuiDialog-container > div').should('be.visible');
  });

});