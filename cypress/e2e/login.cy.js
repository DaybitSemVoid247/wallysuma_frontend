describe('Login', () => {
  it('Debe iniciar sesión correctamente', () => {
    cy.visit('/login');

    cy.get('input[name="email"]').type('admin@test.com');
    cy.get('input[name="password"]').type('123456');

    cy.contains('Iniciar sesión').click();

    cy.url().should('include', '/dashboard');
  });
});
