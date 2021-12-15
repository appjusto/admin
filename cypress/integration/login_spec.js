import getFirebaseClient from '../firebase';

describe('Login', () => {
  let config;

  before(() => {
    config = Cypress.env('firebase');
  });

  it('User can login', async () => {
    // create user
    const { createTestingUser } = await getFirebaseClient(config);
    const { email, password } = await createTestingUser();
    //cy.log('email', email);
    // visit
    cy.visit('/login');
    // filling form
    cy.findByRole('textbox', { name: /e\-mail/i }).type(email);
    cy.findByRole('checkbox', { name: /login-password-checkbox/i }).check({ force: true });
    cy.findByLabelText(/senha/i).type(password);
    cy.findByRole('button', { name: /entrar/i }).click();

    // onboarding
    //cy.findByRole('button', { name: /começar/i }).click();
  });
});
