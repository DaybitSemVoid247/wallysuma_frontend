import { useState } from "react";

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  talla: string;
}

export const Pedidos = () => {
  const productos: Producto[] = [
    {
      id: 1,
      nombre: "Sajta",
      categoria: "Almuerzo",
      precio: 59.0,
      talla: "12",
    },
    {
      id: 2,
      nombre: "Pastel de Chocolate",
      categoria: "Postres",
      precio: 35.0,
      talla: "32",
    },
    {
      id: 3,
      nombre: "Bebida Efervescente de Chilto",
      categoria: "Bebidas",
      precio: 15.0,
      talla: "15",
    },
    {
      id: 4,
      nombre: "Salteña con Cafe",
      categoria: "Desayuno",
      precio: 15.0,
      talla: "15",
    },
  ];

  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("Todas");
  const categorias = [
    "Todas",
    ...Array.from(new Set(productos.map((p) => p.categoria))),
  ];
  const productosFiltrados =
    categoriaSeleccionada === "Todas"
      ? productos
      : productos.filter((p) => p.categoria === categoriaSeleccionada);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Catálogo de Productos</h2>

      <div className="flex gap-2 mb-6">
        {categorias.map((categoria) => (
          <button
            key={categoria}
            onClick={() => setCategoriaSeleccionada(categoria)}
            className={`px-4 py-2 rounded-lg font-medium ${
              categoriaSeleccionada === categoria
                ? "bg-[#d88c6f] text-white"
                : "bg-[#dbbdb1] text-white hover:bg-slate-300"
            }`}
          >
            {categoria}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productosFiltrados.map((producto) => (
          <div key={producto.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-slate-800">
                {producto.nombre}
              </h3>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {producto.categoria}
              </span>
            </div>

            <p className="text-slate-600 text-sm mb-4">
              Cantidad: {producto.talla}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-[#f88358]">
                Bs. {producto.precio.toFixed(2)}
              </span>
              <button className="bg-[#d88c6f] text-white px-4 py-2 rounded-lg hover:bg-[#9e4e2f]">
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pedidos;
