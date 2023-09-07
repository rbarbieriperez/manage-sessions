describe('Navigate to manage clinics screen', () => {
    beforeEach(() => {
        cy.login('Rodrigo Barbieri', 'mtPEs0AkdjfvnOq43TX7LE4Hn0n2');
        cy.wait(3000);
        cy.navigateTo('Administrar Clínicas');
    });


    const fillFields = () => {
        cy.get('#clinicName').type('test');
        cy.get('#fullAddress').type('test');
        cy.get('#number').type('1234');
        cy.get('#additionalInfo').type('test');

        const addContactDetails = '#root > main > div.MuiGrid2-root.MuiGrid2-container.MuiGrid2-direction-xs-row.css-16fig4j-MuiGrid2-root > div.MuiGrid2-root.MuiGrid2-direction-xs-row.MuiGrid2-grid-xs-10.css-1p7x3o5-MuiGrid2-root > button:nth-child(2)';
        cy.get(addContactDetails).click();
        cy.get(addContactDetails).click();
        cy.get(addContactDetails).click();

        cy.get('#root > main > div.MuiGrid2-root.MuiGrid2-container.MuiGrid2-direction-xs-row.css-16fig4j-MuiGrid2-root > div.MuiGrid2-root.MuiGrid2-direction-xs-row.MuiGrid2-grid-xs-10.css-1a7uhzj-MuiGrid2-root > div')
        .should('have.length', 3)
        .each(($item) => {
            cy.wrap($item).find('#description').type('test');
            cy.wrap($item).find('#demo-simple-select').click();
            cy.wrap($item).get('#menu- > div.MuiPaper-root.MuiMenu-paper.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation8.MuiPopover-paper.css-3dzjca-MuiPaper-root-MuiPopover-paper-MuiMenu-paper > ul > li:nth-child(1)').click();
            cy.wrap($item).find('#value').type('test');
        });
    }

    /* it('Add new clinic', () => {
        fillFields();
        cy.get('#root > main > div.MuiGrid2-root.MuiGrid2-container.MuiGrid2-direction-xs-row.css-16fig4j-MuiGrid2-root > div.MuiGrid2-root.MuiGrid2-direction-xs-row.MuiGrid2-grid-xs-12.css-1du9obc-MuiGrid2-root > button').should('be.enabled');
    }); */


    /* it('Clicking on the reset button should clear all the fields', () => {
        fillFields();
        cy.wait(2000);
        cy.get('#root > main > div.MuiGrid2-root.MuiGrid2-container.MuiGrid2-direction-xs-row.css-16fig4j-MuiGrid2-root > div:nth-child(1) > div > div > div > button:nth-child(2)').click();
        cy.get('#clinicName').should('have.value', '');
        cy.get('#fullAddress').should('have.value', '');
        cy.get('#number').should('have.value', '');
        cy.get('#additionalInfo').should('have.value', '');
        cy.get('#root > main > div.MuiGrid2-root.MuiGrid2-container.MuiGrid2-direction-xs-row.css-16fig4j-MuiGrid2-root > div.MuiGrid2-root.MuiGrid2-direction-xs-row.MuiGrid2-grid-xs-10.css-1a7uhzj-MuiGrid2-root > div')
        .should('have.length', 0);
    });
 */
    it('Modify clinic', () => {

        /** Search */
        cy.get('#clinicName').type('test');
        cy.get('#root > main > div.MuiGrid2-root.MuiGrid2-container.MuiGrid2-direction-xs-row.css-16fig4j-MuiGrid2-root > div:nth-child(1) > div > div > div > button:first-of-type()').click();


        /** Check loaded values */
        cy.get('#clinicName').should('have.value', 'test');
        cy.get('#fullAddress').should('have.value', 'test');
        cy.get('#number').should('have.value', '1234');
        cy.get('#additionalInfo').should('have.value', 'test');


        cy.get('#root > main > div.MuiGrid2-root.MuiGrid2-container.MuiGrid2-direction-xs-row.css-16fig4j-MuiGrid2-root > div.MuiGrid2-root.MuiGrid2-direction-xs-row.MuiGrid2-grid-xs-10.css-1a7uhzj-MuiGrid2-root > div')
        .should('have.length', 3)
        .each(($item) => {
            cy.wrap($item).find('#description').should('have.value', 'test');
            cy.wrap($item).find('#demo-simple-select').should('contain', 'Celular');
            cy.wrap($item).find('#value').should('have.value', 'test');
        });

        /** Check button to be disabled by default */

        cy.get('#root > main > div.MuiGrid2-root.MuiGrid2-container.MuiGrid2-direction-xs-row.css-16fig4j-MuiGrid2-root > div.MuiGrid2-root.MuiGrid2-direction-xs-row.MuiGrid2-grid-xs-12.css-1du9obc-MuiGrid2-root > button').should('be.disabled');
    
        
        /** Change some data and re-check button */

        cy.get('#clinicName').type('test1');
        cy.get('#root > main > div.MuiGrid2-root.MuiGrid2-container.MuiGrid2-direction-xs-row.css-16fig4j-MuiGrid2-root > div.MuiGrid2-root.MuiGrid2-direction-xs-row.MuiGrid2-grid-xs-12.css-1du9obc-MuiGrid2-root > button').should('not.be.disabled');
    });
});