import * as cpfutils from '@fnando/cpf';
import * as cnpjutils from '@fnando/cnpj';

// helpers
const testingPhone = '81999999999';
const fakeBankAgency = '66400';
const fakeBankAccount = '2204363';
const fakeAddress = {
  cep: '01310200',
  number: '1578',
};

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
    cy.clearOnboardingBusinesses();
  });

  it('User can finish the onboarding', () => {
    // login
    cy.customLogin(email, password);
    cy.wait(10000);

    // start onboarding
    cy.findByRole('button', { name: /começar/i }).click();

    // fill and submit manager form
    cy.findByRole('textbox', { name: /e\-mail/i }).should('be.disabled');
    cy.findByRole('textbox', { name: 'Nome *' }).type('Severino');
    cy.findByRole('textbox', { name: 'Sobrenome *' }).type('Bill');
    cy.findByRole('textbox', { name: /celular/i }).type(testingPhone);
    cy.findByRole('textbox', { name: /cpf \*/i }).type(cpf);
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

    // fill and submit banking info form
    cy.findByRole('combobox', { name: /banco \*/i }).select('Banco do Brasil');
    cy.findByRole('textbox', { name: /agência \*/i }).type(fakeBankAgency);
    cy.findByRole('textbox', { name: /conta \*/i }).type(fakeBankAccount);
    cy.findByRole('button', { name: /salvar e continuar/i }).click();

    // fill and submit address form
    cy.findByRole('textbox', { name: /cep \*/i }).type(fakeAddress.cep);
    cy.wait(2000);
    cy.findByRole('textbox', { name: /número \*/i }).type(fakeAddress.number);
    cy.findByRole('textbox', { name: /raio\/ km \*/i })
      .clear()
      .type('6');
    cy.findByRole('button', { name: /salvar e continuar/i }).click();
    cy.wait(3000);

    // confirm account creation
    cy.findByRole('button', { name: /confirmar e criar minha conta/i }).click();
    cy.wait(3000);

    // user is in home page
    cy.findByRole('heading', { name: /início/i }).should('be.visible');
  });
});
