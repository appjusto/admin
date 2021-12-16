// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import '@testing-library/cypress/add-commands';
import getFirebaseClient from '../firebase';

Cypress.Commands.add('login', (email, password) => {
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
