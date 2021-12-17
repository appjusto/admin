describe('Business Menu', () => {
  beforeEach(() => {
    // login
    cy.userLogin();
    // assert
    cy.wait(4000);
    // user is in home page
    cy.findByRole('heading', { name: /início/i }).should('be.visible');
    // navigate to business menu page
    cy.findByRole('link', { name: /sidebar\-link\-cardápio/i }).click();
    cy.findByRole('heading', { name: /cardápio/i }).should('be.visible');
  });

  it('User can create complements', () => {
    // navigate to complements
    cy.findByLabelText(/nav\-complementos/i).click();
  });
});
