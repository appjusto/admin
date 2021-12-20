import '@testing-library/cypress/add-commands';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import { attachCustomCommands } from 'cypress-firebase';

const config = Cypress.env('firebase');

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

// Auth
const auth = firebase.auth();
auth.useEmulator('http://localhost:9099');

attachCustomCommands({ Cypress, cy, firebase });

// handlers
const createTestingUser = async (email, password) => {
  try {
    await auth.createUserWithEmailAndPassword(email, password);
  } catch (error) {
    console.log('createUserError', error);
  }
  return { email, password };
};

Cypress.Commands.add('createTestUsers', () => {
  const mainUserEmail = Cypress.env('main_user_email');
  const mainUserPassword = Cypress.env('main_user_password');
  const onboardingUserEmail = Cypress.env('onboarding_user_email');
  const onboardingUserPassword = Cypress.env('onboarding_user_password');
  createTestingUser(mainUserEmail, mainUserPassword);
  createTestingUser(onboardingUserEmail, onboardingUserPassword);
});

Cypress.Commands.add('userLogin', (email, password) => {
  const defaultEmail = Cypress.env('main_user_email');
  const defaultPassword = Cypress.env('main_user_password');
  const currentEmail = email ?? defaultEmail;
  cy.log('currentEmail', currentEmail);
  // visit
  cy.visit('/login');
  // filling login form
  cy.findByRole('textbox', { name: /e\-mail/i }).type(currentEmail);
  cy.findByRole('checkbox', { name: /login-password-checkbox/i }).check({ force: true });
  cy.findByLabelText(/senha/i).type(password ?? defaultPassword);
  cy.findByRole('button', { name: /entrar/i }).click();
});

Cypress.Commands.add('mainUserLogin', () => {
  // login
  cy.userLogin();
  cy.wait(4000);
  // assert user is in home page
  cy.findByRole('heading', { name: /início/i }).should('be.visible');
});

Cypress.Commands.add('fillManagerProfile', (user) => {
  // fill form
  cy.findByRole('textbox', { name: /e\-mail/i }).should('be.disabled');
  cy.findByRole('textbox', { name: 'Nome *' }).clear().type(user.name);
  cy.findByRole('textbox', { name: 'Sobrenome *' }).clear().type(user.lastname);
  cy.findByRole('textbox', { name: /celular/i })
    .clear()
    .type(user.phone);
  cy.findByRole('textbox', { name: /cpf \*/i })
    .clear()
    .type(user.cpf);
});

Cypress.Commands.add('fillBusinessProfile', (business) => {
  // fill form
  cy.findByRole('textbox', { name: /cnpj \*/i })
    .clear()
    .type(business.cnpj);
  cy.findByRole('textbox', { name: /nome do restaurante \*/i })
    .clear()
    .type(business.name);
  cy.findByRole('textbox', { name: /razão social \*/i })
    .clear()
    .type(business.corporateName);
  cy.findByRole('textbox', { name: /telefone para atendimento sobre pedidos \*/i })
    .clear()
    .type(business.phone);
  cy.findByRole('combobox', { name: /tipo de cozinha \*/i }).select(business.cuisine);
  cy.findByRole('textbox', { name: /descrição/i })
    .clear()
    .type(business.description);
});

Cypress.Commands.add('fillBankingInfoForm', () => {
  // fill form
  cy.findByLabelText(/pessoa física/i).click({ force: true });
  cy.findByLabelText(/pessoa jurídica/i).click({ force: true });
  cy.findByRole('combobox', { name: /banco \*/i }).select('Banco do Brasil');
  cy.findByRole('textbox', { name: /agência \*/i })
    .clear()
    .type('66400');
  cy.findByRole('textbox', { name: /conta \*/i })
    .clear()
    .type('2204363');
  cy.findByLabelText(/poupança/i).click({ force: true });
  cy.findByLabelText(/corrente/i).click({ force: true });
});

// helpers
const fakeAddress = {
  cep: '01310200',
  number: '1578',
};

Cypress.Commands.add('fillDeliveryArea', () => {
  // fill form
  cy.findByRole('textbox', { name: /cep \*/i })
    .clear()
    .type(fakeAddress.cep);
  cy.wait(2000);
  cy.findByRole('textbox', { name: /número \*/i })
    .clear()
    .type(fakeAddress.number);
  cy.findByRole('textbox', { name: /raio\/ km \*/i })
    .clear()
    .type('6');
  cy.findByLabelText(/40 minutos/i).click({ force: true });
});
