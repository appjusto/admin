import * as cpfutils from '@fnando/cpf';
import * as cnpjutils from '@fnando/cnpj';

// helpers
const testingPhone = '81999999999';

describe('Onboarding', () => {
  let cpf;
  let cnpj;
  let email;
  let password;

  before(() => {
    cpf = cpfutils.generate();
    cnpj = cnpjutils.generate();
    email = Cypress.env('onboarding_user_email');
    password = Cypress.env('onboarding_user_password');
    cy.log('onboardingUserEmail', email);
    cy.callFirestore('delete', 'businesses', {
      where: ['managers', 'array-contains', email],
    });
  });

  it('User can finish the onboarding', () => {
    // login
    cy.userLogin(email, password);
    cy.wait(10000);
    // start onboarding
    cy.findByRole('button', { name: /começar/i }).click();
    // fill and submit manager form
    cy.findByRole('textbox', { name: /e\-mail/i }).should('be.disabled');
    cy.findByRole('textbox', { name: 'Nome *' }).clear().type('Severino');
    cy.findByRole('textbox', { name: 'Sobrenome *' }).clear().type('Bill');
    cy.findByRole('textbox', { name: /celular/i })
      .clear()
      .type(testingPhone);
    cy.findByRole('textbox', { name: /cpf \*/i })
      .clear()
      .type(cpf);
    cy.findByRole('button', { name: /salvar e continuar/i }).click();
    // fill and submit  business form
    cy.findByRole('textbox', { name: /cnpj \*/i }).type(cnpj);
    cy.findByRole('textbox', { name: /nome do restaurante \*/i }).type('Test');
    cy.findByRole('textbox', { name: /razão social \*/i }).type('TEST LTDA');
    cy.findByRole('textbox', { name: /telefone para atendimento sobre pedidos \*/i }).type(
      testingPhone
    );
    cy.findByRole('combobox', { name: /tipo de cozinha \*/i }).select('Brasileira');
    cy.findByRole('textbox', { name: /descrição/i }).type('Test business');
    cy.findByRole('button', { name: /salvar e continuar/i }).click();
    cy.wait(4000);
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
