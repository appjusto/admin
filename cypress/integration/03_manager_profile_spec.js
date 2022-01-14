import * as cpfutils from '@fnando/cpf';

describe('Manager Profile', () => {
  let user = {};
  let isApproved;
  before(() => {
    isApproved = Cypress.env('approved');
    user = {
      name: 'Main',
      lastname: 'User',
      phone: '81999999999',
      cpf: cpfutils.generate(),
    };
  });
  it('User can save manager profile data', () => {
    // login
    cy.mainUserLogin();
    // navigate to manager profile page
    cy.findByRole('button', { name: /edit product/i }).click({ force: true });
    cy.findByRole('heading', { name: /informe seus dados/i }).should('be.visible');
    // fill and submit form
    cy.fillManagerProfile(user, isApproved);
    cy.findByRole('button', { name: /salvar dados pessoais/i }).click();
    cy.wait(4000);
    // assert
    cy.findAllByText(/informações salvas com sucesso/i).should('be.visible');
  });
});
