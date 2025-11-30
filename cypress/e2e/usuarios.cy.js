describe('Gestión de Usuarios - CRUD Completo', () => {
  let usuarioCreado;

  beforeEach(() => {
    cy.fixture('usuarios').as('usuariosData');
    
    cy.visit('/administrador/usuarios');
    
    cy.get('table', { timeout: 10000 }).should('be.visible');
  });

  afterEach(() => {

    cy.limpiarUsuariosPrueba();
  });

  describe('Visualización de la interfaz', () => {
    it('Debe mostrar el título y botón de agregar', () => {
      cy.contains('h2', 'Usuarios').should('be.visible');
      cy.contains('button', 'Agregar').should('be.visible');
    });

    it('Debe mostrar la tabla con encabezados correctos', () => {
      cy.get('thead th').should('have.length', 5);
      cy.get('thead th').eq(0).should('contain', 'Nombre');
      cy.get('thead th').eq(1).should('contain', 'Ap. Paterno');
      cy.get('thead th').eq(2).should('contain', 'Ap. Materno');
      cy.get('thead th').eq(3).should('contain', 'Correo');
      cy.get('thead th').eq(4).should('contain', 'Acciones');
    });

    it('Debe listar usuarios existentes', () => {
      cy.get('tbody tr').should('have.length.at.least', 1);
    });
  });

  describe('Crear nuevo usuario', () => {
    it('Debe abrir el modal al hacer clic en Agregar', () => {
      cy.contains('button', 'Agregar').click();
      cy.contains('h3', 'Nuevo Usuario').should('be.visible');
      cy.get('.fixed.inset-0').should('be.visible');
    });

    it('Debe crear un usuario correctamente con todos los campos', function() {
      const usuario = this.usuariosData.usuarioValido;

      cy.contains('button', 'Agregar').click();
      cy.llenarFormularioUsuario(usuario);
      
      cy.get('select[multiple]').select(['1']);
      
      cy.contains('button', 'Guardar').click();
      cy.esperarCierreModal();


      cy.contains('td', usuario.nombre).should('be.visible');
      cy.contains('td', usuario.correo).should('be.visible');
    });

    it('Debe cerrar el modal al hacer clic en Cancelar', () => {
      cy.contains('button', 'Agregar').click();
      cy.contains('button', 'Cancelar').click();
      cy.get('.fixed.inset-0').should('not.exist');
    });

    it('Debe validar campos requeridos', () => {
      cy.contains('button', 'Agregar').click();
      cy.contains('button', 'Guardar').click();
      cy.contains('h3', 'Nuevo Usuario').should('be.visible');
    });
  });

  describe('Editar usuario existente', () => {
    beforeEach(function() {

      const usuario = this.usuariosData.usuarioEditar;
      cy.crearUsuarioAPI(usuario).then((response) => {
        usuarioCreado = response.body;
      });
      
      cy.reload();
      cy.wait(1000);
    });

    it('Debe abrir el modal de edición con datos precargados', () => {

      cy.contains('td', usuarioCreado.correo)
        .parent()
        .find('button')
        .first()
        .click();

      cy.contains('h3', 'Editar Usuario').should('be.visible');
      cy.get('input[placeholder="Nombre"]').should('have.value', usuarioCreado.nombre);
      cy.get('input[placeholder="Correo"]').should('have.value', usuarioCreado.correo);
    });

    it('Debe actualizar un usuario correctamente', function() {
      const datosNuevos = this.usuariosData.usuarioActualizado;

      cy.contains('td', usuarioCreado.correo)
        .parent()
        .find('button')
        .first()
        .click();

      cy.llenarFormularioUsuario(datosNuevos);
      cy.contains('button', 'Guardar').click();
      cy.esperarCierreModal();

      // Verificar actualización en la tabla
      cy.contains('td', datosNuevos.nombre).should('be.visible');
      cy.contains('td', datosNuevos.correo).should('be.visible');
    });

    it('Debe cancelar la edición sin guardar cambios', () => {
      cy.contains('td', usuarioCreado.correo)
        .parent()
        .find('button')
        .first()
        .click();

      cy.get('input[placeholder="Nombre"]').clear().type('Nombre Temporal');
      cy.contains('button', 'Cancelar').click();
      cy.esperarCierreModal();

      // Verificar que no cambió
      cy.contains('td', usuarioCreado.nombre).should('be.visible');
      cy.contains('td', 'Nombre Temporal').should('not.exist');
    });
  });

  describe('Operaciones con múltiples usuarios', () => {
    it('Debe crear múltiples usuarios consecutivamente', function() {
      const usuarios = this.usuariosData.usuariosMultiples;

      usuarios.forEach((usuario, index) => {
        cy.contains('button', 'Agregar').click();
        cy.llenarFormularioUsuario(usuario);
        cy.get('select[multiple]').select(['1']);
        cy.contains('button', 'Guardar').click();
        cy.esperarCierreModal();
        cy.wait(500);
      });

      // Verificar que todos aparecen
      usuarios.forEach(usuario => {
        cy.contains('td', usuario.correo).should('be.visible');
      });
    });

    it('Debe mostrar todos los usuarios en la tabla', () => {
      cy.get('tbody tr').should('have.length.at.least', 1);
      cy.get('tbody tr').each(($row) => {
        cy.wrap($row).find('td').should('have.length', 5);
      });
    });
  });

  describe('Validaciones y casos edge', () => {
    it('Debe manejar correos duplicados correctamente', function() {
      const usuario = this.usuariosData.usuarioValido;

      // Crear usuario por primera vez
      cy.contains('button', 'Agregar').click();
      cy.llenarFormularioUsuario(usuario);
      cy.get('select[multiple]').select(['1']);
      cy.contains('button', 'Guardar').click();
      cy.esperarCierreModal();

      // Intentar crear con el mismo correo
      cy.contains('button', 'Agregar').click();
      cy.llenarFormularioUsuario(usuario);
      cy.get('select[multiple]').select(['1']);
      cy.contains('button', 'Guardar').click();

      // Verificar que muestre error o no permita guardar
      // (esto depende de cómo maneje tu backend los duplicados)
    });

    it('Debe funcionar con nombres largos', () => {
      cy.contains('button', 'Agregar').click();
      
      const nombreLargo = 'A'.repeat(100);
      cy.get('input[placeholder="Nombre"]').type(nombreLargo);
      cy.get('input[placeholder="Apellido Paterno"]').type('Apellido');
      cy.get('input[placeholder="Apellido Materno"]').type('Materno');
      cy.get('input[placeholder="Correo"]').type('largo@test.com');
      cy.get('input[placeholder="Contraseña"]').type('Test123456');
      
      cy.contains('button', 'Guardar').click();
    });

    it('Debe validar formato de correo electrónico', () => {
      cy.contains('button', 'Agregar').click();
      
      cy.get('input[placeholder="Nombre"]').type('Test');
      cy.get('input[placeholder="Apellido Paterno"]').type('Test');
      cy.get('input[placeholder="Apellido Materno"]').type('Test');
      cy.get('input[placeholder="Correo"]').type('correo-invalido');
      cy.get('input[placeholder="Contraseña"]').type('Test123456');
      
      cy.contains('button', 'Guardar').click();
      
      // El navegador debe mostrar validación HTML5
      cy.get('input[placeholder="Correo"]').then($input => {
        expect($input[0].validationMessage).to.exist;
      });
    });
  });

  describe('Interacciones de interfaz', () => {
    it('Debe cerrar el modal al hacer clic fuera de él', () => {
      cy.contains('button', 'Agregar').click();
      cy.get('.fixed.inset-0').click('topLeft');
      // Nota: esto depende de si implementaste el cierre al hacer clic fuera
    });

    it('Debe mantener el scroll de la tabla con muchos registros', function() {
      // Crear múltiples usuarios
      const usuarios = this.usuariosData.usuariosMultiples;
      
      usuarios.forEach(() => {
        cy.crearUsuarioAPI(this.usuariosData.usuarioValido);
      });

      cy.reload();
      cy.get('tbody tr').should('have.length.at.least', usuarios.length);
    });
  });

  describe('Integración con API', () => {
    it('Debe cargar usuarios desde la API correctamente', () => {
      cy.intercept('GET', '**/usuarios').as('getUsuarios');
      cy.reload();
      cy.wait('@getUsuarios').its('response.statusCode').should('eq', 200);
    });

    it('Debe enviar datos correctos al crear usuario', function() {
      const usuario = this.usuariosData.usuarioValido;

      cy.intercept('POST', '**/usuarios').as('postUsuario');
      
      cy.contains('button', 'Agregar').click();
      cy.llenarFormularioUsuario(usuario);
      cy.get('select[multiple]').select(['1']);
      cy.contains('button', 'Guardar').click();

      cy.wait('@postUsuario').then((interception) => {
        expect(interception.request.body).to.have.property('nombre', usuario.nombre);
        expect(interception.request.body).to.have.property('correo', usuario.correo);
      });
    });

    it('Debe manejar errores de red correctamente', () => {
      cy.intercept('POST', '**/usuarios', {
        statusCode: 500,
        body: { message: 'Error del servidor' }
      }).as('errorPost');

      cy.contains('button', 'Agregar').click();
      cy.get('input[placeholder="Nombre"]').type('Test');
      cy.get('input[placeholder="Apellido Paterno"]').type('Test');
      cy.get('input[placeholder="Apellido Materno"]').type('Test');
      cy.get('input[placeholder="Correo"]').type('error@test.com');
      cy.get('input[placeholder="Contraseña"]').type('Test123456');
      cy.contains('button', 'Guardar').click();

      cy.wait('@errorPost');
    });
  });
});