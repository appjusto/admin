import * as cpfutils from '@fnando/cpf';
import * as cnpjutils from '@fnando/cnpj';

describe('Onboarding', () => {
  let user;
  let business;
  let email;
  let password;

  before(() => {
    email = Cypress.env('onboarding_user_email');
    password = Cypress.env('onboarding_user_password');
    cy.callFirestore('delete', 'businesses', {
      where: ['managers', 'array-contains', email],
    });
    cy.log('onboardingUserEmail', email);
    user = {
      name: 'Onboarding',
      lastname: 'User',
      phone: '11999999999',
      cpf: cpfutils.generate(),
    };
    business = {
      cnpj: cnpjutils.generate(),
      name: 'Teste de onboarding',
      corporateName: 'TESTES LTDA',
      phone: '11999999999',
      cuisine: 'Brasileira',
      description: 'Restaurante para teste de onboarding',
    };
  });

  it('User can finish the onboarding', () => {
    // login
    cy.userLogin(email, password);
    cy.wait(10000);
    // start onboarding
    cy.findByRole('button', { name: /começar/i }).click();
    // fill and submit manager form
    cy.fillManagerProfile(user);
    cy.findByRole('button', { name: /salvar e continuar/i }).click();
    // fill and submit  business form
    cy.fillBusinessProfile(business);
    cy.findByRole('button', { name: /salvar e continuar/i }).click();
    cy.wait(6000);
    // fill and submit banking info form
    cy.fillBankingInfoForm();
    cy.findByRole('button', { name: /salvar e continuar/i }).click();
    cy.wait(4000);
    // fill and submit address form
    cy.fillDeliveryArea();
    cy.findByRole('button', { name: /salvar e continuar/i }).click();
    cy.wait(4000);
    // confirm account creation
    cy.findByRole('button', { name: /confirmar e criar minha conta/i }).click({ force: true });
    cy.wait(4000);
    // user is in home page
    cy.findByRole('heading', { name: /início/i }).should('be.visible');
  });
});
