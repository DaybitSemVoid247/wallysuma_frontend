Cypress.Commands.add('login', (correo, contrasena) => {
  cy.visit('/');
  cy.get('input[type="email"]').type(correo);
  cy.get('input[type="password"]').type(contrasena);
  cy.get('button[type="submit"]').click();
  
  // Esperar a que redirija al dashboard
  cy.url().should('not.include', '/login');
});
Cypress.Commands.add('crearUsuarioAPI', (usuario) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/usuarios`,
    body: usuario,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('eliminarUsuarioAPI', (usuarioId) => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/usuarios/${usuarioId}`,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('limpiarUsuariosPrueba', () => {
  cy.request(`${Cypress.env('apiUrl')}/usuarios`).then((response) => {
    const usuariosPrueba = response.body.filter(u => 
      u.correo.includes('test') || u.correo.includes('prueba')
    );
    
    usuariosPrueba.forEach(usuario => {
      cy.eliminarUsuarioAPI(usuario.id);
    });
  });
});

Cypress.Commands.add('crearProductoAPI', (producto) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/productos`,
    body: producto,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('eliminarProductoAPI', (productoId) => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/productos/${productoId}`,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('llenarFormularioUsuario', (usuario) => {
  cy.get('input[placeholder="Nombre"]').clear().type(usuario.nombre);
  cy.get('input[placeholder="Apellido Paterno"]').clear().type(usuario.apellidoPaterno);
  cy.get('input[placeholder="Apellido Materno"]').clear().type(usuario.apellidoMaterno);
  cy.get('input[placeholder="Correo"]').clear().type(usuario.correo);
  
  if (usuario.contrasena) {
    cy.get('input[placeholder="Contraseña"]').clear().type(usuario.contrasena);
  }
});

Cypress.Commands.add('llenarFormularioProducto', (producto) => {
  cy.get('input[placeholder*="Hamburguesa"]').clear().type(producto.nombre);
  cy.get('select').first().select(producto.categoria);
  cy.get('input[type="number"][step="0.01"]').clear().type(producto.precio.toString());
  cy.get('input[type="number"][placeholder="0"]').clear().type(producto.stock.toString());
});

Cypress.Commands.add('esperarCierreModal', () => {
  cy.get('.fixed.inset-0', { timeout: 10000 }).should('not.exist');
});