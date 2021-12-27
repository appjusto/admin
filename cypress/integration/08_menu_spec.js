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
    cy.findByRole('button', { name: /adicionar\-complemento\-molhos\-especiais/i }).click();
    cy.wait(2000);
    cy.findByRole('combobox', { name: /grupo de complementos/i })
      .find(':selected')
      .should('have.text', 'Molhos especiais');
    cy.findByRole('textbox', { name: /nome do item/i }).type('Tomate');
    cy.findByRole('textbox', { name: /descrição do item/i }).type('Molho de tomate especial');
    cy.findByRole('textbox', { name: /preço\-do\-novo\-complemento/i }).type('500');
    cy.findByRole('button', { name: /btn\-plus/i }).click();
    cy.findByRole('button', { name: /salvar/i }).click();
    cy.wait(2000);
    // assert: complement was created
    cy.findAllByText(/tomate/i).should('be.visible');
  });

  it('User can create products', () => {
    // create category
    cy.findByRole('button', { name: /adicionar categoria/i }).click();
    cy.findByRole('textbox', { name: /nova categoria/i }).type('Prato do dia');
    cy.findByRole('button', { name: /salvar/i }).click();
    // assert: category was created
    cy.findByText(/prato do dia/i).should('be.visible');
    // add product to category
    cy.findByRole('button', { name: /adicionar\-produto\-prato\-do\-dia/i }).click();
    cy.wait(2000);
    cy.findByRole('combobox', { name: /categoria/i })
      .find(':selected')
      .should('have.text', 'Prato do dia');
    cy.findByRole('textbox', { name: /nome/i }).type('Feijoada');
    cy.findByRole('textbox', { name: /descrição/i }).type('Feijoada completa (500g)');
    cy.findByRole('textbox', { name: /preço\-do\-novo\-produto/i }).type('3000');
    cy.findByRole('checkbox', { name: /orgânico\-checkbox/i }).check({ force: true });
    cy.findByRole('button', { name: /salvar/i }).click();
    // assert: product was created
    cy.findByText(/Produto salvo com sucesso\!/i).should('be.visible');
  });

  it('User can associate complements group to product', () => {
    // open product details
    cy.findByRole('button', { name: /editar\-produto\-feijoada/i }).click({ force: true });
    cy.findByRole('link', { name: /complementos/i }).click();
    cy.findByLabelText(/complements\-enabled/i).click({ force: true });
    cy.findByRole('checkbox', { name: /molhos\-especiais\-checkbox/i }).check({ force: true });
    cy.findByRole('button', { name: /salvar alterações/i }).click();
    // assert: complements group was associated
    cy.findAllByText(/informações salvas com sucesso\!/i).should('be.visible');
  });

  it('User can save product availability', () => {
    // open product details
    cy.findByRole('button', { name: /editar\-produto\-feijoada/i }).click({ force: true });
    // navigate to availability
    cy.findByRole('link', { name: /disponibilidade/i }).click();
    cy.findByLabelText(/availability\-defined/i).click({ force: true });
    // uncheck
    cy.findByRole('checkbox', { name: /segunda/i }).check({ force: true });
    // defined but without schedules
    cy.findByLabelText(/terça\-defined/i).click({ force: true });
    // two turns
    cy.findByLabelText(/quarta\-defined/i).click({ force: true });
    cy.findByRole('textbox', { name: /quarta\-from\-0/i }).type('10');
    cy.findByRole('textbox', { name: /quarta\-to\-0/i }).type('14');
    cy.findByLabelText(/adicionar\-turno\-quarta/).click();
    cy.findByRole('textbox', { name: /quarta\-from\-1/i }).type('16');
    cy.findByRole('textbox', { name: /quarta\-to\-1/i }).type('20');
    cy.findByLabelText(/replicar\-anterior\-quinta/i).click();
    cy.findByLabelText(/replicar\-anterior\-sexta/i).click();
    // replicate and remove turn
    cy.findByLabelText(/replicar\-anterior\-sábado/i).click();
    cy.findByLabelText(/sábado\-close\-1/).click();
    /// replicate
    cy.findByLabelText(/replicar\-anterior\-domingo/i).click();
    // submit
    cy.findByRole('button', { name: /salvar disponibilidade/i }).click();
    // assert: availability was saved
    cy.findAllByText(/informações salvas com sucesso\!/i).should('be.visible');
  });

  it('User can delete product', () => {
    // open product details
    cy.findByRole('button', { name: /editar\-produto\-feijoada/i }).click({ force: true });
    cy.findByRole('button', { name: /apagar produto/i }).click();
    cy.findByRole('button', { name: /apagar produto/i }).click();
    // assert: product was deleted
    cy.findAllByText(/informações salvas com sucesso\!/i).should('be.visible');
    cy.findByText(/feijoada/i).should('not.exist');
  });

  it('User can delete category', () => {
    // open category details
    cy.findByRole('button', { name: /editar\-categoria\-prato\-do\-dia/i }).click({ force: true });
    cy.findByRole('button', { name: /apagar categoria/i }).click();
    cy.findByRole('button', { name: /apagar categoria/i }).click();
    cy.wait(2000);
    // assert: category was deleted
    cy.findByText(/prato\-do\-dia/i).should('not.exist');
  });

  it('User can delete complement', () => {
    // navigate to complements
    cy.findByLabelText(/nav\-complementos/i).click();
    // open complement details
    cy.findByRole('button', { name: /editar\-complemento\-tomate/i }).click({ force: true });
    cy.findByRole('button', { name: /apagar complemento/i }).click();
    cy.findByRole('button', { name: /apagar complemento/i }).click();
    // assert: complement was deleted
    cy.findAllByText(/informações salvas com sucesso\!/i).should('be.visible');
    cy.findByText(/tomate/i).should('not.exist');
  });
  it('User can delete complements group', () => {
    // navigate to complements
    cy.findByLabelText(/nav\-complementos/i).click();
    // open group details
    cy.findByRole('button', { name: /editar\-grupo\-molhos\-especiais/i }).click({ force: true });
    cy.findByRole('button', { name: /apagar grupo/i }).click();
    cy.findByRole('button', { name: /apagar grupo/i }).click();
    cy.wait(2000);
    // assert: group was deleted
    cy.findByText(/molhos\-especiais/i).should('not.exist');
  });
});
