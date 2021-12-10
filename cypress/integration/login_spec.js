describe('Login', () => {
  it('User can login', () => {
    // visit
    cy.visit('/login');
    // filling form
    cy.findByRole('textbox', { name: /e\-mail/i }).type('testuser@test.com');
    cy.findByRole('checkbox', { name: /login-password-checkbox/i }).check({ force: true });
    cy.findByLabelText(/senha/i).type('testing');
    cy.findByRole('button', { name: /entrar/i }).click();
  });
});
