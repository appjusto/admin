describe('Business Delivery Area', () => {
  it('User can save delivery area information', () => {
    // login
    cy.mainUserLogin();
    // navigate to delivery area page
    cy.findByRole('link', { name: /área de entrega/i }).click();
    cy.findByRole('heading', { name: /endereço do restaurante/i }).should('be.visible');
    // fill and submit form
    cy.fillDeliveryArea();
    cy.findByRole('button', { name: /salvar/i }).click();
    cy.wait(4000);
    // assert
    cy.findAllByText(/informações salvas com sucesso/i).should('be.visible');
  });
});
