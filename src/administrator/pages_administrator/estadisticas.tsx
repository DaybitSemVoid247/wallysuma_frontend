import { useState } from "react";

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  vendidos: number;
}

export const Estadisticas = () => {
  const [productos] = useState<Producto[]>([
    {
      id: 1,
      nombre: "Sopa del Día",
      categoria: "Entradas",
      precio: 35.0,
      vendidos: 40,
    },
    {
      id: 2,
      nombre: "Pasta Alfredo",
      categoria: "Platos Fuertes",
      precio: 85.0,
      vendidos: 28,
    },
    {
      id: 3,
      nombre: "Ensalada César",
      categoria: "Ensaladas",
      precio: 60.0,
      vendidos: 33,
    },
  ]);

  const totalProductos = productos.length;
  const totalVendidos = productos.reduce((sum, p) => sum + p.vendidos, 0);
  const ingresoTotal = productos.reduce(
    (sum, p) => sum + p.precio * p.vendidos,
    0
  );

  const productosPorCategoria = productos.reduce((acc, producto) => {
    acc[producto.categoria] = (acc[producto.categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topProductos = [...productos]
    .sort((a, b) => b.vendidos - a.vendidos)
    .slice(0, 5);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Estadísticas</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-slate-600 text-sm mb-1">Total de Productos</p>
          <p className="text-3xl font-bold text-cyan-600">{totalProductos}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-slate-600 text-sm mb-1">Productos Vendidos</p>
          <p className="text-3xl font-bold text-green-600">{totalVendidos}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-slate-600 text-sm mb-1">Ingreso Total</p>
          <p className="text-3xl font-bold text-blue-600">
            Bs. {ingresoTotal.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Productos por Categoría</h3>
          <div className="space-y-3">
            {Object.entries(productosPorCategoria).map(
              ([categoria, cantidad]) => (
                <div
                  key={categoria}
                  className="flex justify-between items-center"
                >
                  <span className="text-slate-700">{categoria}</span>
                  <span className="font-bold text-cyan-600">{cantidad}</span>
                </div>
              )
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Productos Más Vendidos</h3>
          <div className="space-y-3">
            {topProductos.map((producto, index) => (
              <div
                key={producto.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-slate-700">{producto.nombre}</span>
                </div>
                <span className="font-bold text-green-600">
                  {producto.vendidos}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
