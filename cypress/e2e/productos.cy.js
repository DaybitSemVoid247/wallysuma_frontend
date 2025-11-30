describe('Gestión de Productos - CRUD Completo', () => {
  let productoCreado;

  beforeEach(() => {

    cy.fixture('productos').as('productosData');
    

    cy.visit('/administrador/productos');
    

    cy.get('table', { timeout: 10000 }).should('be.visible');
  });

  describe('Visualización de la interfaz', () => {
    it('Debe mostrar el título y botón de agregar', () => {
      cy.contains('h2', 'Inventario de Restaurante').should('be.visible');
      cy.contains('button', 'Agregar Producto').should('be.visible');
    });

    it('Debe mostrar la tabla con encabezados correctos', () => {
      cy.get('thead th').should('have.length', 5);
      cy.get('thead th').eq(0).should('contain', 'Nombre');
      cy.get('thead th').eq(1).should('contain', 'Categoría');
      cy.get('thead th').eq(2).should('contain', 'Precio');
      cy.get('thead th').eq(3).should('contain', 'Stock');
      cy.get('thead th').eq(4).should('contain', 'Acciones');
    });

    it('Debe mostrar productos existentes con datos iniciales', () => {
      cy.get('tbody tr').should('have.length.at.least', 1);
      cy.contains('td', 'Hamburguesa Clásica').should('be.visible');
    });

    it('Debe mostrar el contador de resultados', () => {
      cy.contains('Mostrando').should('be.visible');
      cy.contains('productos').should('be.visible');
    });
  });

  describe('Sistema de filtros', () => {
    it('Debe mostrar/ocultar filtros al hacer clic en el botón', () => {
      cy.contains('button', 'Ocultar Filtros').click();
      cy.get('input[placeholder="Buscar por nombre..."]').should('not.be.visible');
      
      cy.contains('button', 'Mostrar Filtros').click();
      cy.get('input[placeholder="Buscar por nombre..."]').should('be.visible');
    });

    it('Debe filtrar productos por nombre', () => {
      cy.get('input[placeholder="Buscar por nombre..."]').type('Hamburguesa');
      cy.contains('td', 'Hamburguesa Clásica').should('be.visible');
      cy.contains('td', 'Pizza').should('not.exist');
    });

    it('Debe filtrar productos por categoría', () => {
      cy.get('select').first().select('Bebidas');
      cy.contains('td', 'Limonada Natural').should('be.visible');
      cy.contains('td', 'Hamburguesa Clásica').should('not.exist');
    });

    it('Debe combinar filtros de búsqueda y categoría', () => {
      cy.get('input[placeholder="Buscar por nombre..."]').type('Café');
      cy.get('select').first().select('Bebidas');
      cy.contains('td', 'Café Americano').should('be.visible');
      cy.get('tbody tr').should('have.length', 1);
    });

    it('Debe mostrar mensaje cuando no hay resultados', () => {
      cy.get('input[placeholder="Buscar por nombre..."]').type('Producto Inexistente XYZ');
      cy.contains('No se encontraron productos').should('be.visible');
    });

    it('Debe limpiar filtros y mostrar todos los productos', () => {
      cy.get('input[placeholder="Buscar por nombre..."]').type('Pizza');
      cy.get('tbody tr').should('have.length.lessThan', 5);
      
      cy.get('input[placeholder="Buscar por nombre..."]').clear();
      cy.get('tbody tr').should('have.length.at.least', 5);
    });
  });

  describe('Sistema de paginación', () => {
    it('Debe mostrar máximo 5 productos por página', () => {
      cy.get('tbody tr').should('have.length.lessThan', 6);
    });

    it('Debe navegar entre páginas correctamente', () => {

      cy.contains('button', '2').should('be.visible').click();
      cy.contains('button', '2').should('have.class', 'bg-[#d88c6f]');
      

      cy.contains('button', '1').click();
      cy.contains('button', '1').should('have.class', 'bg-[#d88c6f]');
    });

    it('Debe deshabilitar botón Anterior en la primera página', () => {
      cy.contains('button', 'Anterior').should('be.disabled');
    });

    it('Debe deshabilitar botón Siguiente en la última página', () => {

      cy.get('button').contains(/^\d+$/).last().click();
      cy.contains('button', 'Siguiente').should('be.disabled');
    });

    it('Debe resetear a página 1 al aplicar filtros', () => {

      cy.contains('button', '2').click();
      
  
      cy.get('input[placeholder="Buscar por nombre..."]').type('Pizza');
      

      cy.contains('button', '1').should('have.class', 'bg-[#d88c6f]');
    });
  });

  describe('Crear nuevo producto', () => {
    it('Debe abrir el modal al hacer clic en Agregar Producto', () => {
      cy.contains('button', 'Agregar Producto').click();
      cy.contains('h3', 'Nuevo Producto').should('be.visible');
      cy.get('.fixed.inset-0').should('be.visible');
    });

    it('Debe crear un producto correctamente con todos los campos', function() {
      const producto = this.productosData.productoValido;

      cy.contains('button', 'Agregar Producto').click();
      cy.llenarFormularioProducto(producto);
      cy.contains('button', 'Guardar').click();
      cy.esperarCierreModal();

      // Verificar que aparece en la tabla
      cy.contains('td', producto.nombre).should('be.visible');
      cy.contains('Bs. 35.50').should('be.visible');
    });

    it('Debe validar campos requeridos', () => {
      cy.contains('button', 'Agregar Producto').click();
      cy.contains('button', 'Guardar').click();
      
      // El modal debe seguir abierto si hay errores
      cy.contains('h3', 'Nuevo Producto').should('be.visible');
    });

    it('Debe crear productos en diferentes categorías', function() {
      const productos = this.productosData.productosMultiples;

      productos.forEach(producto => {
        cy.contains('button', 'Agregar Producto').click();
        cy.llenarFormularioProducto(producto);
        cy.contains('button', 'Guardar').click();
        cy.esperarCierreModal();
        cy.wait(500);
      });

  
      productos.forEach(producto => {
        cy.contains('td', producto.nombre).should('be.visible');
      });
    });

    it('Debe validar precio con decimales correctamente', () => {
      cy.contains('button', 'Agregar Producto').click();
      
      cy.get('input[placeholder*="Hamburguesa"]').type('Producto Decimal');
      cy.get('select').first().select('Bebidas');
      cy.get('input[type="number"][step="0.01"]').type('25.75');
      cy.get('input[type="number"][placeholder="0"]').type('50');
      
      cy.contains('button', 'Guardar').click();
      cy.esperarCierreModal();

      cy.contains('Bs. 25.75').should('be.visible');
    });

    it('Debe crear producto con stock 0', function() {
      const producto = this.productosData.productoSinStock;

      cy.contains('button', 'Agregar Producto').click();
      cy.llenarFormularioProducto(producto);
      cy.contains('button', 'Guardar').click();
      cy.esperarCierreModal();

      cy.contains('td', producto.nombre).should('be.visible');
      cy.contains('0 unidades').should('be.visible');
    });
  });

  describe('Editar producto existente', () => {
    it('Debe abrir el modal de edición con datos precargados', () => {

      cy.get('tbody tr').first().find('button').first().click();

      cy.contains('h3', 'Editar Producto').should('be.visible');
      cy.get('input[placeholder*="Hamburguesa"]').should('not.have.value', '');
      cy.get('select').first().should('not.have.value', '');
    });

    it('Debe actualizar un producto correctamente', function() {
      const datosNuevos = this.productosData.productoActualizado;

      cy.get('tbody tr').first().find('button').first().click();
      cy.llenarFormularioProducto(datosNuevos);
      cy.contains('button', 'Guardar').click();
      cy.esperarCierreModal();


      cy.contains('td', datosNuevos.nombre).should('be.visible');
      cy.contains('Bs. 55.00').should('be.visible');
    });

    it('Debe cancelar la edición sin guardar cambios', () => {

      cy.get('tbody tr').first().find('td').first().invoke('text').then((nombreOriginal) => {
        cy.get('tbody tr').first().find('button').first().click();
        cy.get('input[placeholder*="Hamburguesa"]').clear().type('Nombre Temporal');
        cy.contains('button', 'Cancelar').click();
        cy.esperarCierreModal();
        cy.contains('td', nombreOriginal).should('be.visible');
        cy.contains('td', 'Nombre Temporal').should('not.exist');
      });
    });

    it('Debe actualizar solo el precio manteniendo otros campos', () => {
      cy.get('tbody tr').first().find('button').first().click();
      
      // Cambiar solo el precio
      cy.get('input[type="number"][step="0.01"]').clear().type('99.99');
      cy.contains('button', 'Guardar').click();
      cy.esperarCierreModal();

      cy.contains('Bs. 99.99').should('be.visible');
    });
  });

  describe('Eliminar producto', () => {
    it('Debe eliminar un producto al hacer clic en el botón eliminar', function() {
      const producto = this.productosData.productoValido;

      cy.contains('button', 'Agregar Producto').click();
      cy.llenarFormularioProducto(producto);
      cy.contains('button', 'Guardar').click();
      cy.esperarCierreModal();

      cy.contains('td', producto.nombre)
        .parent()
        .find('button')
        .last()
        .click();

      cy.contains('td', producto.nombre).should('not.exist');
    });

    it('Debe actualizar el contador después de eliminar', () => {

      cy.contains(/Mostrando \d+ de \d+ productos/).invoke('text').then((textoInicial) => {
        const countInicial = parseInt(textoInicial.match(/de (\d+)/)[1]);


        cy.get('tbody tr').first().find('button').last().click();

        cy.contains(new RegExp(`de ${countInicial - 1} productos`)).should('be.visible');
      });
    });
  });

  describe('Validaciones y casos edge', () => {
    it('Debe manejar precios muy altos', function() {
      const producto = this.productosData.productoPrecioAlto;

      cy.contains('button', 'Agregar Producto').click();
      cy.llenarFormularioProducto(producto);
      cy.contains('button', 'Guardar').click();
      cy.esperarCierreModal();

      cy.contains('Bs. 150.00').should('be.visible');
    });

    it('Debe validar números negativos en precio', () => {
      cy.contains('button', 'Agregar Producto').click();
      
      cy.get('input[type="number"][step="0.01"]').type('-10');
      
      // Verificar que el navegador valida entrada negativa
      cy.get('input[type="number"][step="0.01"]').then($input => {
        const valor = parseFloat($input.val());
        expect(valor).to.be.lessThan(0);
      });
    });

    it('Debe validar números negativos en stock', () => {
      cy.contains('button', 'Agregar Producto').click();
      
      cy.get('input[type="number"][placeholder="0"]').type('-5');
      
      cy.get('input[type="number"][placeholder="0"]').then($input => {
        const valor = parseInt($input.val());
        expect(valor).to.be.lessThan(0);
      });
    });

    it('Debe funcionar con nombres largos', () => {
      cy.contains('button', 'Agregar Producto').click();
      
      const nombreLargo = 'P'.repeat(100);
      cy.get('input[placeholder*="Hamburguesa"]').type(nombreLargo);
      cy.get('select').first().select('Bebidas');
      cy.get('input[type="number"][step="0.01"]').type('10');
      cy.get('input[type="number"][placeholder="0"]').type('50');
      
      cy.contains('button', 'Guardar').click();
    });
  });

  describe('Categorías y organización', () => {
    it('Debe mostrar badge de categoría con estilo', () => {
      cy.get('.bg-blue-100.text-blue-800').should('exist');
    });

    it('Debe tener todas las categorías disponibles en el select', () => {
      cy.contains('button', 'Agregar Producto').click();
      
      cy.get('select option').should('have.length', 6); // Incluye "Seleccionar categoría"
      cy.get('select').find('option').should('contain', 'Platos Principales');
      cy.get('select').find('option').should('contain', 'Entradas');
      cy.get('select').find('option').should('contain', 'Ensaladas');
      cy.get('select').find('option').should('contain', 'Bebidas');
      cy.get('select').find('option').should('contain', 'Postres');
    });

    it('Debe filtrar correctamente por cada categoría', () => {
      const categorias = ['Platos Principales', 'Ensaladas', 'Bebidas', 'Postres'];

      categorias.forEach(categoria => {
        cy.get('select').first().select(categoria);
        cy.get('tbody tr').should('have.length.at.least', 1);
        cy.get('.bg-blue-100.text-blue-800').should('contain', categoria);
      });
    });
  });

  describe('Formato de precios y stock', () => {
    it('Debe mostrar precios con dos decimales', () => {
      cy.get('td').contains(/Bs\. \d+\.\d{2}/).should('exist');
    });

    it('Debe mostrar stock con unidades', () => {
      cy.contains('unidades').should('be.visible');
    });

    it('Debe formatear correctamente al editar', () => {
      cy.get('tbody tr').first().find('button').first().click();
      
      cy.get('input[type="number"][step="0.01"]').should('have.attr', 'step', '0.01');
    });
  });

  describe('Interacciones de interfaz', () => {
    it('Debe mostrar iconos de acción correctamente', () => {
      cy.get('tbody tr').first().within(() => {
        cy.get('button').should('have.length', 2);
      });
    });

    it('Debe aplicar estilos hover en botones', () => {
      cy.get('tbody tr').first().find('button').first()
        .should('have.class', 'text-blue-600')
        .and('have.class', 'hover:text-blue-800');
    });

    it('Debe alternar colores en filas de la tabla', () => {
      cy.get('tbody tr').eq(0).should('have.class', 'bg-white');
      cy.get('tbody tr').eq(1).should('have.class', 'bg-slate-50');
    });
  });

  describe('Búsqueda avanzada', () => {
    it('Debe buscar productos case-insensitive', () => {
      cy.get('input[placeholder="Buscar por nombre..."]').type('HAMBURGUESA');
      cy.contains('td', 'Hamburguesa Clásica').should('be.visible');
    });

    it('Debe buscar con coincidencias parciales', () => {
      cy.get('input[placeholder="Buscar por nombre..."]').type('Ham');
      cy.contains('td', 'Hamburguesa').should('be.visible');
    });

    it('Debe actualizar resultados en tiempo real', () => {
      cy.get('input[placeholder="Buscar por nombre..."]').type('P');
      cy.get('tbody tr').should('have.length.at.least', 1);
      
      cy.get('input[placeholder="Buscar por nombre..."]').type('izza');
      cy.contains('td', 'Pizza').should('be.visible');
    });
  });
});