import getFirebaseClient from '../firebase';

describe('Business Schedules', () => {
  let config;
  let userEmail;
  let userPassword;

  before(() => {
    config = Cypress.env('firebase');
    userEmail = Cypress.env('main_user_email');
    userPassword = Cypress.env('main_user_password');
  });

  it('User can save business schedules', async () => {
    // create user
    const { currentUser } = await getFirebaseClient(config);
    // visit
    if (!currentUser) {
      cy.visit('/login');
      // filling form
      cy.findByRole('textbox', { name: /e\-mail/i }).type(userEmail);
      cy.findByRole('checkbox', { name: /login-password-checkbox/i }).check({ force: true });
      cy.findByLabelText(/senha/i).type(userPassword);
      cy.findByRole('button', { name: /entrar/i }).click();
      // assert
      cy.wait(4000);
      // user is in home page
      cy.findByRole('heading', { name: /início/i }).should('be.visible');
    } else {
      cy.visit('/app');
    }
    // navigate to business schedules page
    cy.findByRole('link', { name: /horários/i }).click();
    cy.findByRole('heading', { name: /horário/i }).should('be.visible');
    // fill schedules form
    // Monday
    cy.findByLabelText(/segunda\-checkbox/i).check({ force: true });
    cy.findByRole('textbox', { name: /segunda\-from\-0/i }).type('16');
    cy.findByRole('textbox', { name: /segunda\-to\-0/i }).type('2000');
    // Tuesday
    cy.findByLabelText(/terça\-checkbox/i).check({ force: true });
    cy.findByLabelText(/terça-break/i).click({ force: true });
    cy.findByRole('textbox', { name: /terça\-from\-0/i }).type('10');
    cy.findByRole('textbox', { name: /terça\-to\-0/i }).type('14');
    cy.findByRole('textbox', { name: /terça\-from\-1/i }).type('16');
    cy.findByRole('textbox', { name: /terça\-to\-1/i }).type('22');
    // Wednesday
    cy.findByLabelText(/quarta\-replication\-link/i).click({ force: true });
    // Thursday
    cy.findByLabelText(/quinta\-checkbox/i).check({ force: true });
    cy.findByLabelText(/quinta\-replication\-link/i).click({ force: true });
    // Friday
    cy.findByLabelText(/sexta\-checkbox/i).check({ force: true });
    cy.findByRole('textbox', { name: /sexta\-from\-0/i }).type('1000');
    cy.findByRole('textbox', { name: /sexta\-to\-0/i }).type('2300');
    // Saturday
    cy.findByLabelText(/sábado\-checkbox/i).check({ force: true });
    cy.findByLabelText(/sábado\-replication\-link/i).click({ force: true });
    // Sunday
    cy.findByLabelText(/domingo\-replication\-link/i).click({ force: true });
    // submit
    cy.findByRole('button', { name: /salvar horários/i }).click();
    cy.wait(4000);
    // assert
    cy.findAllByText(/informações salvas com sucesso/i).should('be.visible');
  });
});
