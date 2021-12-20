describe('Business Menu', () => {
  beforeEach(() => {
    // login
    cy.mainUserLogin();
    // navigate to business menu page
    cy.findByRole('link', { name: /sidebar\-link\-cardápio/i }).click();
    cy.findByRole('heading', { name: /cardápio/i }).should('be.visible');
  });

  it('User can create complements', () => {
    // navigate to complements
    cy.findByLabelText(/nav\-complementos/i).click();
    // create complements group
    cy.findByRole('button', { name: /adicionar grupo/i }).click();
    cy.findByRole('textbox', { name: /grupo de complementos/i }).type('Molhos especiais');
    cy.findByLabelText(/obrigatório/i).click({ force: true });
    cy.findByRole('button', { name: /máximo\-plus/i })
      .click()
      .click();
    cy.findByRole('button', { name: /máximo\-minus/i }).click();
    cy.findByRole('button', { name: /salvar/i }).click();
    // assert: group was created
    cy.findByText(/molhos especiais/i).should('be.visible');
    // add complement to group
    cy.findByRole('button', { name: /adicionar-complemento-molhos-especiais/i }).click();
    cy.wait(2000);
    cy.findByRole('combobox', { name: /grupo de complementos/i })
      .find(':selected')
      .should('have.text', 'Molhos especiais');
    cy.findByRole('textbox', { name: /nome do item/i }).type('Tomate');
    cy.findByRole('textbox', { name: /descrição do item/i }).type('Molho de tomate especial');
    cy.findByRole('textbox', { name: /preço/i }).type('500');
    cy.findByRole('button', { name: /btn\-plus/i }).click();
    cy.findByRole('button', { name: /salvar/i }).click();
    // assert: complement was created
    cy.findByText(/tomate/i).should('be.visible');
  });

  it('User can create products', () => {
    // create category
    cy.findByRole('button', { name: /adicionar categoria/i }).click();
    cy.findByRole('textbox', { name: /nova categoria/i }).type('Prato do dia');
    cy.findByRole('button', { name: /salvar/i }).click();
    // assert: category was created
    cy.findByText(/prato do dia/i).should('be.visible');
    // add product to category
    cy.findByRole('button', { name: /adicionar-produto-prato-do-dia/i }).click();
    cy.wait(2000);
    cy.findByRole('combobox', { name: /categoria/i })
      .find(':selected')
      .should('have.text', 'Prato do dia');
    cy.findByRole('textbox', { name: /nome/i }).type('Feijoada');
    cy.findByRole('textbox', { name: /descrição/i }).type('Feijoada completa (500g)');
    cy.findByRole('textbox', { name: /preço/i }).type('3000');
    cy.findByRole('checkbox', { name: /orgânico-checkbox/i }).check({ force: true });
    cy.findByRole('button', { name: /salvar/i }).click();
    // assert: product was created
    cy.findByText(/Produto salvo com sucesso\!/i).should('be.visible');
  });
});
