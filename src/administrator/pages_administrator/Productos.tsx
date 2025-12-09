// src/administrator/pages_administrator/Productos.tsx
import { useState, useEffect } from "react";
import {
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlinePlus,
  HiOutlineSearch,
  HiChevronDown,
  HiChevronUp,
  HiOutlinePhotograph,
  HiOutlineGlobe, // ← NUEVO ICONO
} from "react-icons/hi";
import { TranslationModal } from "../../components/translations/TranslationModal"; // ← IMPORTAR MODAL
import type { TipoEntidad } from "../../components/translations/types"; // ← IMPORTAR TIPO

// ... (todas tus interfaces se mantienen igual)
interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

interface Subcategoria {
  id: number;
  nombre: string;
  descripcion?: string;
  categoria: Categoria;
  activo: boolean;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  disponibilidad?: number;
  imagen: string | null;
  subcategoria: Subcategoria;
  activo: boolean;
}

const API_URL = "http://localhost:3000";

// ... (tu servicio API se mantiene igual)
const api = {
  async getProductos(): Promise<Producto[]> {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) throw new Error("Error al cargar productos");
    return response.json();
  },

  async createProducto(data: any): Promise<Producto> {
    console.log("🔗 POST", `${API_URL}/productos`, data);
    const response = await fetch(`${API_URL}/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log("📥 Respuesta:", response.status, responseData);

    if (!response.ok) {
      throw new Error(
        `Error al crear producto (${response.status}): ${JSON.stringify(
          responseData
        )}`
      );
    }
    return responseData;
  },

  async updateProducto(id: number, data: any): Promise<Producto> {
    console.log("🔗 PATCH", `${API_URL}/productos/${id}`, data);
    const response = await fetch(`${API_URL}/productos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log("📥 Respuesta:", response.status, responseData);

    if (!response.ok) {
      throw new Error(
        `Error al actualizar producto (${response.status}): ${JSON.stringify(
          responseData
        )}`
      );
    }
    return responseData;
  },

  async deleteProducto(id: number): Promise<void> {
    console.log("🔗 DELETE", `${API_URL}/productos/${id}`);
    const response = await fetch(`${API_URL}/productos/${id}`, {
      method: "DELETE",
    });

    console.log("📥 Respuesta DELETE:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error al eliminar:", errorText);
      throw new Error(`Error al eliminar producto (${response.status})`);
    }
  },

  async toggleEstado(id: number, activo: boolean): Promise<Producto> {
    console.log("🔗 PATCH", `${API_URL}/productos/${id}/estado`, { activo });
    const response = await fetch(`${API_URL}/productos/${id}/estado`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo }),
    });

    const responseData = await response.json();
    console.log("📥 Respuesta toggle estado:", response.status, responseData);

    if (!response.ok) {
      throw new Error(
        `Error al cambiar estado (${response.status}): ${JSON.stringify(
          responseData
        )}`
      );
    }
    return responseData;
  },

  async getCategorias(): Promise<Categoria[]> {
    const response = await fetch(`${API_URL}/categorias`);
    if (!response.ok) throw new Error("Error al cargar categorías");
    return response.json();
  },

  async getSubcategorias(): Promise<Subcategoria[]> {
    const response = await fetch(`${API_URL}/subcategorias`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error de subcategorías:", response.status, errorText);
      throw new Error(`Error al cargar subcategorías (${response.status})`);
    }
    return response.json();
  },
};

export const Productos = () => {
  // Estados existentes
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    disponibilidad: "",
    imagen: "",
    subcategoria: "",
  });
  const [imagenPreview, setImagenPreview] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  const itemsPerPage = 5;
  const [imagenFile, setImagenFile] = useState<File | null>(null);

  // 🆕 ESTADOS PARA EL MODAL DE TRADUCCIONES
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null
  );

  // ... (todo tu código de cargarDatos, handleAdd, handleEdit, etc. se mantiene igual)
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      console.log("🔍 Intentando conectar a:", API_URL);

      const productosData = await api.getProductos();
      const categoriasData = await api.getCategorias();

      console.log("✅ Productos cargados:", productosData);
      console.log("✅ Categorías cargadas:", categoriasData);

      let subcategoriasData: Subcategoria[] = [];
      try {
        subcategoriasData = await api.getSubcategorias();
        console.log("✅ Subcategorías cargadas:", subcategoriasData);
      } catch (subError) {
        console.warn("⚠️ No se pudieron cargar subcategorías del endpoint");
        const subcatsMap = new Map<number, Subcategoria>();
        productosData.forEach((p) => {
          if (p.subcategoria && p.subcategoria.id) {
            subcatsMap.set(p.subcategoria.id, p.subcategoria);
          }
        });
        subcategoriasData = Array.from(subcatsMap.values());
      }

      setProductos(
        productosData.map((p) => ({
          ...p,
          precio: Number(p.precio),
          disponibilidad: Number(p.disponibilidad || 0),
        }))
      );
      setCategorias(categoriasData.filter((c) => c.activo));
      setSubcategorias(subcategoriasData.filter((s) => s.activo));
    } catch (error: any) {
      console.error("❌ Error:", error);
      alert("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEstado = async (id: number, nuevoEstado: boolean) => {
    try {
      await api.toggleEstado(id, nuevoEstado);
      await cargarDatos();
      alert(`Producto ${nuevoEstado ? "activado" : "desactivado"}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al cambiar el estado");
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setForm({
      nombre: "",
      descripcion: "",
      precio: "",
      disponibilidad: "",
      imagen: "",
      subcategoria: "",
    });
    setImagenPreview("");
    setShowModal(true);
  };

  const handleEdit = (producto: Producto) => {
    setEditingId(producto.id);
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: producto.precio.toString(),
      disponibilidad: (producto.disponibilidad || 0).toString(),
      imagen: producto.imagen || "",
      subcategoria: producto.subcategoria.id.toString(),
    });
    setImagenPreview(producto.imagen || "");
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Desactivar este producto?")) return;
    try {
      await api.deleteProducto(id);
      await cargarDatos();
      alert("Producto desactivado");
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Selecciona una imagen válida");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Máximo 5MB");
      return;
    }
    setImagenFile(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (
      !form.nombre ||
      !form.precio ||
      !form.disponibilidad ||
      !form.subcategoria
    ) {
      alert("Completa todos los campos");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", form.nombre);
    formData.append("descripcion", form.descripcion);
    formData.append("precio", form.precio);
    formData.append("disponibilidad", form.disponibilidad);
    formData.append("subcategoria", form.subcategoria);

    if (imagenFile) {
      formData.append("imagen", imagenFile);
    }

    try {
      const url = editingId
        ? `${API_URL}/productos/${editingId}`
        : `${API_URL}/productos/upload`;
      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(url, { method, body: formData });
      const data = await response.json();

      if (!response.ok) throw new Error("Error");

      alert(editingId ? "Actualizado" : "Creado");
      await cargarDatos();
      setShowModal(false);
      setImagenFile(null);
      setImagenPreview("");
    } catch (err) {
      alert("Error al guardar");
    }
  };

  // 🆕 FUNCIÓN PARA ABRIR MODAL DE TRADUCCIONES
  const handleTranslate = (producto: Producto) => {
    setSelectedProducto(producto);
    setShowTranslationModal(true);
  };

  // 🆕 FUNCIÓN PARA CERRAR MODAL DE TRADUCCIONES
  const handleCloseTranslationModal = () => {
    setShowTranslationModal(false);
    setSelectedProducto(null);
  };

  // 🆕 FUNCIÓN CUANDO SE GUARDAN TRADUCCIONES
  const handleSaveTranslations = () => {
    console.log("✅ Traducciones guardadas, recargando datos...");
    // Opcional: recargar productos para ver cambios
    // cargarDatos();
  };

  const productosFiltrados = productos.filter((producto) => {
    const matchSearch = producto.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      categoryFilter === "" ||
      producto.subcategoria?.categoria?.id === parseInt(categoryFilter);
    const matchEstado =
      estadoFilter === ""
        ? true
        : estadoFilter === "activo"
        ? producto.activo
        : !producto.activo;
    return matchSearch && matchCategory && matchEstado;
  });

  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productosActuales = productosFiltrados.slice(startIndex, endIndex);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleEstadoChange = (value: string) => {
    setEstadoFilter(value);
    setCurrentPage(1);
  };

  const getImageUrl = (imagen: string | null): string => {
    if (!imagen) {
      return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop";
    }
    if (imagen.startsWith("http")) {
      return imagen;
    }
    const filename = imagen.replace(/^\/uploads\/productos\//, "");
    return `${API_URL}/uploads/productos/${filename}`;
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Cargando productos...</p>
        </div>
      </div>
    );
  }

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

      {/* Filtros */}
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

      {showFilters && (
        <div className="mb-6 bg-white shadow-md rounded-lg p-4 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>

            <select
              value={estadoFilter}
              onChange={(e) => handleEstadoChange(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>
        </div>
      )}

      {/* Tabla con nuevo botón de traducciones */}
      <div className="overflow-x-auto shadow-md rounded-lg bg-white mb-4">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-200 font-semibold">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Categoría</th>
              <th className="px-6 py-3">Subcategoría</th>
              <th className="px-6 py-3">Precio</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Estado</th>
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
                      {producto.subcategoria?.categoria?.nombre ||
                        "Sin categoría"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                      {producto.subcategoria?.nombre || "Sin subcategoría"}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-semibold">
                    Bs. {Number(producto.precio).toFixed(2)}
                  </td>
                  <td className="px-6 py-3">
                    {producto.disponibilidad || 0} unidades
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() =>
                        handleToggleEstado(producto.id, !producto.activo)
                      }
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                        producto.activo
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {producto.activo ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* 🆕 BOTÓN DE TRADUCCIÓN */}
                      <button
                        onClick={() => handleTranslate(producto)}
                        className="text-[#d88c6f] hover:text-[#9e4e2f] transition"
                        title="Traducir producto"
                      >
                        <HiOutlineGlobe size={20} />
                      </button>

                      <button
                        onClick={() => handleEdit(producto)}
                        className="text-blue-600 hover:text-blue-800"
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
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No se encontraron productos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

      {/* Modal de edición/creación (tu modal original se mantiene) */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        >
          <div
            className="rounded-lg p-6 w-full max-w-md border-2 border-slate-300 shadow-2xl max-h-[90vh] overflow-y-auto"
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
                  Descripción
                </label>
                <textarea
                  placeholder="Descripción del producto..."
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm({ ...form, descripcion: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Subcategoría
                </label>
                <select
                  value={form.subcategoria}
                  onChange={(e) =>
                    setForm({ ...form, subcategoria: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                >
                  <option value="">Seleccionar subcategoría</option>
                  {categorias.map((cat) => (
                    <optgroup key={cat.id} label={cat.nombre}>
                      {subcategorias
                        .filter((sub) => sub.categoria.id === cat.id)
                        .map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.nombre}
                          </option>
                        ))}
                    </optgroup>
                  ))}
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
                  value={form.disponibilidad}
                  onChange={(e) =>
                    setForm({ ...form, disponibilidad: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Imagen del producto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagenChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                />
                {imagenPreview && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      Vista previa:
                    </p>
                    <div className="relative">
                      <img
                        src={imagenPreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border-2 border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagenPreview("");
                          setImagenFile(null);
                          setForm({ ...form, imagen: "" });
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
                        title="Eliminar imagen"
                      >
                        <HiOutlineTrash size={16} />
                      </button>
                    </div>
                  </div>
                )}
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
      {/* 🆕 MODAL DE TRADUCCIONES */}
      {selectedProducto && (
        <TranslationModal
          show={showTranslationModal}
          onClose={handleCloseTranslationModal}
          onSave={handleSaveTranslations}
          entidad={"producto" as TipoEntidad}
          entidadId={selectedProducto.id}
          nombreOriginal={selectedProducto.nombre}
          descripcionOriginal={selectedProducto.descripcion}
        />
      )}
    </div>
  );
};

export default Productos;
