import * as cnpjutils from '@fnando/cnpj';

describe('Business Profile', () => {
  let business = {};
  let isApproved;
  before(() => {
    isApproved = Cypress.env('approved');
    business = {
      cnpj: cnpjutils.generate(),
      name: 'Restaurante para testes',
      corporateName: 'TESTES LTDA',
      cuisine: 'Brasileira',
      description: 'Restaurante usado para testes com usuário padrão',
      phoneType1: 'Gerente',
      phone1: '11999999999',
      phoneType2: 'Balcão',
      phone2: '11988888888',
    };
  });
  it('User can save business profile data', () => {
    // login
    cy.mainUserLogin();
    // navigate to business profile page
    cy.findByRole('link', { name: /sidebar\-link\-perfil do restaurante/i }).click();
    cy.findByRole('heading', { name: /perfil do restaurante/i }).should('be.visible');
    // fill and submit form
    cy.fillBusinessProfile(business, isApproved);
    cy.findByRole('button', { name: /salvar/i }).click();
    cy.wait(2000);
    // assert
    cy.findAllByText(/informações salvas com sucesso/i).should('be.visible');
  });
});
