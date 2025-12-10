// src/administrator/pages_administrator/Productos.tsx
import { useState, useEffect } from "react";
import {
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlinePlus,
  HiOutlineSearch,
  HiChevronDown,
  HiChevronUp,
  HiOutlineGlobe,
  HiExclamation,
  HiCheckCircle,
  HiXCircle,
} from "react-icons/hi";
import { TranslationModal } from "../../components/translations/TranslationModal";
import type { TipoEntidad } from "../../components/translations/types";
import api, { API_BASE_URL } from "../../config/api"; // ⭐ IMPORTAR AXIOS

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

type ModalType = "success" | "error" | "confirm" | "info" | null;

interface ModalState {
  show: boolean;
  type: ModalType;
  title: string;
  message: string;
  onConfirm?: () => void;
}

// ⭐ MODAL BONITO (tu código original)
const CustomModal = ({
  modal,
  onClose,
  onConfirm,
}: {
  modal: ModalState;
  onClose: () => void;
  onConfirm?: () => void;
}) => {
  if (!modal.show) return null;

  const getIcon = () => {
    switch (modal.type) {
      case "success":
        return (
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <HiCheckCircle className="w-12 h-12 text-white" />
          </div>
        );
      case "error":
        return (
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
            <HiXCircle className="w-12 h-12 text-white" />
          </div>
        );
      case "confirm":
        return (
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
            <HiExclamation className="w-12 h-12 text-white" />
          </div>
        );
      case "info":
        return (
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <HiExclamation className="w-12 h-12 text-white" />
          </div>
        );
      default:
        return null;
    }
  };

  const getColors = () => {
    switch (modal.type) {
      case "success":
        return {
          border: "border-green-600",
          title: "text-green-700",
          button: "bg-green-600 hover:bg-green-700",
        };
      case "error":
        return {
          border: "border-red-600",
          title: "text-red-700",
          button: "bg-red-600 hover:bg-red-700",
        };
      case "confirm":
        return {
          border: "border-yellow-600",
          title: "text-yellow-700",
          button: "bg-yellow-600 hover:bg-yellow-700",
        };
      case "info":
        return {
          border: "border-blue-600",
          title: "text-blue-700",
          button: "bg-blue-600 hover:bg-blue-700",
        };
      default:
        return {
          border: "border-gray-600",
          title: "text-gray-700",
          button: "bg-gray-600 hover:bg-gray-700",
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
      <div
        className={`bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border-4 ${colors.border}`}
      >
        <div className="mb-6 flex justify-center">{getIcon()}</div>
        <h2 className={`text-3xl font-bold mb-4 ${colors.title}`}>
          {modal.title}
        </h2>
        <p className="text-gray-700 mb-6 text-lg whitespace-pre-line">
          {modal.message}
        </p>
        <div className="flex gap-3">
          {modal.type === "confirm" && onConfirm ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-bold text-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 px-4 py-3 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 ${colors.button}`}
              >
                Confirmar
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className={`w-full px-4 py-3 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 ${colors.button}`}
            >
              Aceptar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const Productos = () => {
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
  const [modal, setModal] = useState<ModalState>({
    show: false,
    type: null,
    title: "",
    message: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  const itemsPerPage = 5;
  const [imagenFile, setImagenFile] = useState<File | null>(null);

  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null
  );

  // Funciones para modales
  const showSuccessModal = (title: string, message: string) => {
    setModal({ show: true, type: "success", title, message });
  };
  const showErrorModal = (title: string, message: string) => {
    setModal({ show: true, type: "error", title, message });
  };
  const showConfirmModal = (
    title: string,
    message: string,
    onConfirm: () => void
  ) => {
    setModal({ show: true, type: "confirm", title, message, onConfirm });
  };
  const closeModal = () => {
    setModal({ show: false, type: null, title: "", message: "" });
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ⭐ REESCRITO CON AXIOS
  const cargarDatos = async () => {
    try {
      setLoading(true);
      console.log("🔄 Cargando productos del administrador...");

      // Usar axios configurado
      const [productosRes, categoriasRes] = await Promise.all([
        api.get<Producto[]>("/productos"),
        api.get<Categoria[]>("/categorias"),
      ]);

      console.log("✅ Productos cargados:", productosRes.data);
      console.log("✅ Categorías cargadas:", categoriasRes.data);

      let subcategoriasData: Subcategoria[] = [];
      try {
        const subcategoriasRes = await api.get<Subcategoria[]>(
          "/subcategorias"
        );
        subcategoriasData = subcategoriasRes.data;
        console.log("✅ Subcategorías cargadas:", subcategoriasData);
      } catch (subError) {
        console.warn("⚠️ Extrayendo subcategorías de productos...");
        const subcatsMap = new Map<number, Subcategoria>();
        productosRes.data.forEach((p) => {
          if (p.subcategoria && p.subcategoria.id) {
            subcatsMap.set(p.subcategoria.id, p.subcategoria);
          }
        });
        subcategoriasData = Array.from(subcatsMap.values());
      }

      setProductos(
        productosRes.data.map((p) => ({
          ...p,
          precio: Number(p.precio),
          disponibilidad: Number(p.disponibilidad || 0),
        }))
      );
      setCategorias(categoriasRes.data.filter((c) => c.activo));
      setSubcategorias(subcategoriasData.filter((s) => s.activo));
    } catch (error: any) {
      console.error("❌ Error al cargar datos:", error);
      const mensaje =
        error.response?.data?.message || error.message || "Error desconocido";
      showErrorModal(
        "Error de Conexión",
        `No se pudieron cargar los datos.\n\n${mensaje}`
      );
    } finally {
      setLoading(false);
    }
  };

  // ⭐ REESCRITO CON AXIOS
  const handleToggleEstado = async (id: number, nuevoEstado: boolean) => {
    try {
      await api.patch(`/productos/${id}/estado`, { activo: nuevoEstado });
      await cargarDatos();
      showSuccessModal(
        "Estado Actualizado",
        `Producto ${nuevoEstado ? "activado" : "desactivado"} correctamente`
      );
    } catch (error) {
      console.error("❌ Error al cambiar estado:", error);
      showErrorModal("Error", "No se pudo cambiar el estado del producto.");
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

  // ⭐ REESCRITO CON AXIOS
  const handleDelete = async (id: number) => {
    showConfirmModal(
      "Confirmar Desactivación",
      "¿Estás seguro de que deseas desactivar este producto?",
      async () => {
        try {
          await api.delete(`/productos/${id}`);
          await cargarDatos();
          showSuccessModal(
            "Producto Desactivado",
            "El producto ha sido desactivado correctamente"
          );
        } catch (error) {
          console.error("❌ Error al eliminar:", error);
          showErrorModal(
            "Error al Eliminar",
            "No se pudo eliminar el producto."
          );
        }
      }
    );
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showErrorModal("Archivo Inválido", "Selecciona una imagen válida");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showErrorModal("Archivo Muy Grande", "La imagen no debe superar los 5MB");
      return;
    }
    setImagenFile(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  // ⭐ REESCRITO CON AXIOS (pero FormData se sigue usando)
  const handleSave = async () => {
    if (
      !form.nombre ||
      !form.precio ||
      !form.disponibilidad ||
      !form.subcategoria
    ) {
      showErrorModal(
        "Campos Incompletos",
        "Completa todos los campos obligatorios"
      );
      return;
    }

    const formData = new FormData();
    formData.append("nombre", form.nombre);
    formData.append("descripcion", form.descripcion);
    formData.append("precio", form.precio);
    formData.append("disponibilidad", form.disponibilidad);
    formData.append("subcategoria", form.subcategoria);
    if (imagenFile) formData.append("imagen", imagenFile);

    try {
      if (editingId) {
        // Actualizar con PATCH y FormData
        await api.patch(`/productos/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Crear con POST y FormData
        await api.post("/productos/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await cargarDatos();
      showSuccessModal(
        editingId ? "Producto Actualizado" : "Producto Creado",
        editingId
          ? "El producto ha sido actualizado correctamente"
          : "El producto ha sido creado exitosamente"
      );
      setShowModal(false);
      setImagenFile(null);
      setImagenPreview("");
    } catch (error: any) {
      console.error("❌ Error al guardar:", error);
      const mensaje = error.response?.data?.message || "Error desconocido";
      showErrorModal(
        "Error al Guardar",
        `No se pudo guardar el producto.\n\n${mensaje}`
      );
    }
  };

  const handleTranslate = (producto: Producto) => {
    setSelectedProducto(producto);
    setShowTranslationModal(true);
  };

  const handleCloseTranslationModal = () => {
    setShowTranslationModal(false);
    setSelectedProducto(null);
  };

  const handleSaveTranslations = () => {
    console.log("✅ Traducciones guardadas");
    cargarDatos(); // Recargar para ver cambios
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
    return `${API_BASE_URL}/uploads/productos/${filename}`;
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
      {/* 🆕 Modal Personalizado */}
      <CustomModal
        modal={modal}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
      />

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

            {/* Filtro por estado */}
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
