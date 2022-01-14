const fakeBankAgency = '66400';
const fakeBankAccount = '2204363';

describe('Business Banking information', () => {
  let isApproved;
  before(() => {
    isApproved = Cypress.env('approved');
  });
  it('User can save banking information', () => {
    // login
    cy.mainUserLogin();
    // navigate to business schedules page
    cy.findByRole('button', { name: /edit product/i }).click({ force: true });
    cy.findByRole('heading', { name: /dados bancários/i }).should('be.visible');
    // fill form
    cy.fillBankingInfoForm(isApproved);
    if (!isApproved) {
      cy.findByRole('button', { name: /salvar dados bancários/i }).click();
      cy.wait(4000);
      // assert
      cy.findAllByText(/informações salvas com sucesso/i).should('be.visible');
    }
  });
});
