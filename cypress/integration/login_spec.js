import getFirebaseClient from '../firebase';

describe('Login', () => {
  let config;
  let userEmail;
  let userPassword;

  before(() => {
    config = Cypress.env('firebase');
    userEmail = Cypress.env('main_user_email');
    userPassword = Cypress.env('main_user_password');
  });

  it('User can login', async () => {
    // create user
    const { createTestingUser } = await getFirebaseClient(config);
    const { email, password } = await createTestingUser(userEmail, userPassword);
    // visit
    cy.visit('/login');
    // filling form
    cy.findByRole('textbox', { name: /e\-mail/i }).type(email);
    cy.findByRole('checkbox', { name: /login-password-checkbox/i }).check({ force: true });
    cy.findByLabelText(/senha/i).type(password);
    cy.findByRole('button', { name: /entrar/i }).click();
    // assert
    cy.wait(10000);
    cy.findByRole('button', { name: /começar/i }).should('be.visible');
  });
});
