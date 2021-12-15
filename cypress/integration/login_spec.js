import getFirebaseClient from '../firebase';

const userEmail = 'testlogin@test.com';
const userPassword = 'Testing1234';

describe('Login', () => {
  let config;

  before(() => {
    config = Cypress.env('firebase');
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
