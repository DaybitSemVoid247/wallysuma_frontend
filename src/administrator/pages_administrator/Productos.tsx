import { useState } from "react";
import {
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlinePlus,
  HiOutlineSearch,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
}

export const Productos = () => {
  const [productos, setProductos] = useState<Producto[]>([
    {
      id: 1,
      nombre: "Hamburguesa Clásica",
      categoria: "Platos Principales",
      precio: 35.0,
      stock: 50,
    },
    {
      id: 2,
      nombre: "Pizza Margarita",
      categoria: "Platos Principales",
      precio: 45.0,
      stock: 30,
    },
    {
      id: 3,
      nombre: "Ensalada César",
      categoria: "Ensaladas",
      precio: 25.0,
      stock: 40,
    },
    {
      id: 4,
      nombre: "Pasta Carbonara",
      categoria: "Platos Principales",
      precio: 42.0,
      stock: 35,
    },
    {
      id: 5,
      nombre: "Limonada Natural",
      categoria: "Bebidas",
      precio: 12.0,
      stock: 100,
    },
    {
      id: 6,
      nombre: "Café Americano",
      categoria: "Bebidas",
      precio: 10.0,
      stock: 80,
    },
    {
      id: 7,
      nombre: "Cheesecake",
      categoria: "Postres",
      precio: 28.0,
      stock: 20,
    },
    {
      id: 8,
      nombre: "Brownie con Helado",
      categoria: "Postres",
      precio: 22.0,
      stock: 25,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
  });

  // Estados para filtros y paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  const itemsPerPage = 5;

  const handleAdd = () => {
    setEditingId(null);
    setForm({ nombre: "", categoria: "", precio: "", stock: "" });
    setShowModal(true);
  };

  const handleEdit = (producto: Producto) => {
    setEditingId(producto.id);
    setForm({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio.toString(),
      stock: producto.stock.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setProductos(productos.filter((p) => p.id !== id));
  };

  const handleSave = () => {
    if (!form.nombre || !form.categoria || !form.precio || !form.stock) return;

    const productoData = {
      nombre: form.nombre,
      categoria: form.categoria,
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock),
    };

    if (editingId) {
      setProductos(
        productos.map((p) =>
          p.id === editingId ? { ...p, ...productoData } : p
        )
      );
    } else {
      setProductos([...productos, { id: Date.now(), ...productoData }]);
    }
    setShowModal(false);
  };

  // Filtrar productos
  const productosFiltrados = productos.filter((producto) => {
    const matchSearch = producto.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      categoryFilter === "" || producto.categoria === categoryFilter;
    return matchSearch && matchCategory;
  });

  // Paginación
  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productosActuales = productosFiltrados.slice(startIndex, endIndex);

  // Resetear página cuando cambian los filtros
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Inventario de Restaurante
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#d88c6f] text-white px-4 py-2 rounded-lg hover:bg-[#9e4e2f] transition"
        >
          <HiOutlinePlus size={18} />
          Agregar Producto
        </button>
      </div>

      {/* Botón para mostrar/ocultar filtros */}
      <div className="mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg transition font-medium"
        >
          {showFilters ? (
            <>
              <HiChevronUp size={20} />
              Ocultar Filtros
            </>
          ) : (
            <>
              <HiChevronDown size={20} />
              Mostrar Filtros
            </>
          )}
        </button>
      </div>

      {/* Filtros colapsables */}
      {showFilters && (
        <div className="mb-6 bg-white shadow-md rounded-lg p-4 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Buscador */}
            <div className="relative">
              <HiOutlineSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-white"
              />
            </div>

            {/* Filtro por categoría */}
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Todas las categorías</option>
              <option value="Platos Principales">Platos Principales</option>
              <option value="Entradas">Entradas</option>
              <option value="Ensaladas">Ensaladas</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Postres">Postres</option>
            </select>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto shadow-md rounded-lg bg-white mb-4">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-200 font-semibold">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Categoría</th>
              <th className="px-6 py-3">Precio</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosActuales.length > 0 ? (
              productosActuales.map((producto, index) => (
                <tr
                  key={producto.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                >
                  <td className="px-6 py-3 font-medium">{producto.nombre}</td>
                  <td className="px-6 py-3">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {producto.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-semibold">
                    Bs. {producto.precio.toFixed(2)}
                  </td>
                  <td className="px-6 py-3">{producto.stock} unidades</td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => handleEdit(producto)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      title="Editar"
                    >
                      <HiOutlinePencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(producto.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      <HiOutlineTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No se encontraron productos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Contador de resultados centrado */}
      <div className="text-center text-sm text-slate-600 mb-3">
        Mostrando {productosActuales.length} de {productosFiltrados.length}{" "}
        productos
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition bg-white"
          >
            Anterior
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition ${
                  currentPage === page
                    ? "bg-[#d88c6f] text-white"
                    : "border border-slate-300 hover:bg-slate-100 bg-white"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition bg-white"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        >
          <div
            className="rounded-lg p-6 w-full max-w-md border-2 border-slate-300 shadow-2xl"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(8px)",
            }}
          >
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              {editingId ? "Editar Producto" : "Nuevo Producto"}
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre del producto
                </label>
                <input
                  type="text"
                  placeholder="Ej: Hamburguesa Clásica"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Categoría
                </label>
                <select
                  value={form.categoria}
                  onChange={(e) =>
                    setForm({ ...form, categoria: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="Platos Principales">Platos Principales</option>
                  <option value="Entradas">Entradas</option>
                  <option value="Ensaladas">Ensaladas</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Postres">Postres</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Precio (Bs.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium bg-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-[#9e4e2f] transition font-medium"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;
