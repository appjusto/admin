import './commands';

Cypress.env('main_user_email', 'mainuser@test.com');
Cypress.env('main_user_password', 'Testing1234');
Cypress.env('onboarding_user_email', 'onbuser@test.com');
Cypress.env('onboarding_user_password', 'OnbTesting1234');

beforeEach(() => {
  cy.createTestUsers();
});
