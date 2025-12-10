import { useState, useEffect } from "react";
import {
  HiOutlineRefresh,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineShoppingBag,
  HiOutlineEye,
  HiOutlineX,
} from "react-icons/hi";

interface Usuario {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
}

interface Producto {
  id: number;
  nombre: string;
  precio: string;
  imagen: string | null;
}

interface DetallePedido {
  id: number;
  producto: Producto;
  cantidad: number;
  precioUnitario: string;
  subtotal: string;
}

interface Pedido {
  id: number;
  numeroPedido: string;
  cliente: Usuario;
  fechaCreacion: string;
  estado: string;
  metodoPago: string;
  tipoEntrega: string;
  total: string;
  subtotal: string;
  notas?: string;
  detalles: DetallePedido[];
}

const API_URL = "http://192.168.0.8:3000";

const api = {
  async getTodosPedidos(): Promise<Pedido[]> {
    const response = await fetch(`${API_URL}/pedidos`);
    if (!response.ok) throw new Error("Error al cargar pedidos");
    const data = await response.json();
    return data.datos || data;
  },

  async actualizarEstadoPedido(pedidoId: number, nuevoEstado: string) {
    const response = await fetch(`${API_URL}/pedidos/${pedidoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    if (!response.ok) throw new Error("Error al actualizar pedido");
    return response.json();
  },
};

export function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState<number | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(
    null
  );
  const [mensaje, setMensaje] = useState<{
    texto: string;
    tipo: "success" | "error";
  } | null>(null);

  const estadosDisponibles = [
    { value: "todos", label: "Todos", color: "bg-gray-600" },
    { value: "PENDIENTE", label: "Pendiente", color: "bg-red-600" },
    { value: "ACEPTADO", label: "Aceptado", color: "bg-blue-600" },
    {
      value: "EN_PREPARACION",
      label: "En Preparación",
      color: "bg-yellow-600",
    },
    { value: "LISTO", label: "Listo", color: "bg-green-600" },
    { value: "COMPLETADO", label: "Completado", color: "bg-emerald-600" },
    { value: "CANCELADO", label: "Cancelado", color: "bg-gray-800" },
  ];

  useEffect(() => {
    cargarPedidos();
    const interval = setInterval(cargarPedidos, 30000);
    return () => clearInterval(interval);
  }, []);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const data = await api.getTodosPedidos();
      setPedidos(data);
    } catch (error: any) {
      console.error("Error al cargar pedidos:", error);
      mostrarMensaje("Error al cargar pedidos", "error");
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (pedidoId: number, nuevoEstado: string) => {
    try {
      setActualizando(pedidoId);
      await api.actualizarEstadoPedido(pedidoId, nuevoEstado);
      mostrarMensaje(`Pedido marcado como ${nuevoEstado}`, "success");
      await cargarPedidos();

      if (pedidoSeleccionado && pedidoSeleccionado.id === pedidoId) {
        const pedidoActualizado = pedidos.find((p) => p.id === pedidoId);
        if (pedidoActualizado) {
          setPedidoSeleccionado({ ...pedidoActualizado, estado: nuevoEstado });
        }
      }
    } catch (error: any) {
      console.error("Error al actualizar pedido:", error);
      mostrarMensaje("Error al actualizar el pedido", "error");
    } finally {
      setActualizando(null);
    }
  };

  const mostrarMensaje = (texto: string, tipo: "success" | "error") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 4000);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getImageUrl = (imagen: string | null): string => {
    if (!imagen) {
      return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop";
    }
    if (imagen.startsWith("http")) {
      return imagen;
    }
    const filename = imagen.replace(/^\/uploads\/productos\//, "");
    return `${API_URL}/uploads/productos/${filename}`;
  };

  const getEstadoColor = (estado: string) => {
    const estadoObj = estadosDisponibles.find((e) => e.value === estado);
    return estadoObj?.color || "bg-gray-600";
  };

  const getEstadoLabel = (estado: string) => {
    const estadoObj = estadosDisponibles.find((e) => e.value === estado);
    return estadoObj?.label || estado;
  };

  const pedidosFiltrados =
    filtroEstado === "todos"
      ? pedidos
      : pedidos.filter((p) => p.estado === filtroEstado);

  if (loading && pedidos.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <HiOutlineShoppingBag className="text-orange-600" size={36} />
              Gestión de Pedidos
              <span className="bg-orange-600 text-white px-4 py-1 rounded-full text-xl">
                {pedidosFiltrados.length}
              </span>
            </h1>
            <button
              onClick={cargarPedidos}
              disabled={loading}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition"
            >
              <HiOutlineRefresh
                size={20}
                className={loading ? "animate-spin" : ""}
              />
              Actualizar
            </button>
          </div>
        </div>

        {/* Mensaje de notificación */}
        {mensaje && (
          <div
            className={`mb-6 p-4 rounded-lg border-l-4 font-semibold ${
              mensaje.tipo === "success"
                ? "bg-green-100 text-green-800 border-green-600"
                : "bg-red-100 text-red-800 border-red-600"
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        {/* Filtros de estado */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Filtrar por estado:
          </h3>
          <div className="flex flex-wrap gap-2">
            {estadosDisponibles.map((estado) => (
              <button
                key={estado.value}
                onClick={() => setFiltroEstado(estado.value)}
                className={`px-4 py-2 rounded-lg font-semibold text-white transition-all ${
                  filtroEstado === estado.value
                    ? `${estado.color} shadow-lg scale-105`
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                {estado.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de pedidos */}
        {pedidosFiltrados.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <HiOutlineShoppingBag
              size={64}
              className="mx-auto mb-4 text-gray-300"
            />
            <p className="text-xl text-gray-500 font-semibold">
              No hay pedidos para mostrar
            </p>
            <p className="text-gray-400 mt-2">
              Los pedidos aparecerán aquí automáticamente
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max table-auto">
                <thead className="bg-orange-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-sm">
                      N° Pedido
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-sm">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-sm">
                      Productos
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-sm">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-sm">
                      Detalles
                    </th>
                    <th className="px-4 py-3 text-right font-bold text-sm">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-sm">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-center font-bold text-sm w-40">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pedidosFiltrados.map((pedido) => (
                    <tr
                      key={pedido.id}
                      className="hover:bg-orange-50 transition"
                    >
                      {/* Número de pedido */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-bold text-orange-600 text-base">
                          #{pedido.numeroPedido.split("-")[2]}
                        </span>
                      </td>

                      {/* Cliente */}
                      <td className="px-4 py-3">
                        <div className="max-w-xs">
                          <p className="font-semibold text-gray-800 text-sm truncate">
                            {pedido.cliente.nombre}{" "}
                            {pedido.cliente.apellidoPaterno}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {pedido.cliente.correo}
                          </p>
                        </div>
                      </td>

                      {/* Productos */}
                      <td className="px-4 py-3">
                        <div className="space-y-1 max-w-xs">
                          {pedido.detalles.slice(0, 2).map((detalle) => (
                            <div key={detalle.id} className="text-xs truncate">
                              <span className="font-medium">
                                {detalle.cantidad}x
                              </span>{" "}
                              {detalle.producto.nombre}
                            </div>
                          ))}
                          {pedido.detalles.length > 2 && (
                            <p className="text-xs text-gray-500">
                              +{pedido.detalles.length - 2} más
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getEstadoColor(
                            pedido.estado
                          )}`}
                        >
                          {getEstadoLabel(pedido.estado)}
                        </span>
                      </td>

                      {/* Detalles */}
                      <td className="px-4 py-3">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-semibold">
                              {pedido.metodoPago}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold">
                              {pedido.tipoEntrega === "LLEVAR"
                                ? "Para llevar"
                                : "Para aquí"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <p className="text-lg font-bold text-orange-600">
                          Bs. {parseFloat(pedido.total).toFixed(2)}
                        </p>
                      </td>

                      {/* Fecha */}
                      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                        {formatearFecha(pedido.fechaCreacion)}
                      </td>

                      {/* Acción */}
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-center flex-wrap">
                          {pedido.estado === "PENDIENTE" && (
                            <button
                              onClick={() =>
                                cambiarEstado(pedido.id, "ACEPTADO")
                              }
                              disabled={actualizando === pedido.id}
                              className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition flex items-center gap-1 font-semibold text-sm whitespace-nowrap"
                            >
                              <HiOutlineCheck size={16} />
                              {actualizando === pedido.id ? "..." : "Aceptar"}
                            </button>
                          )}

                          {pedido.estado === "ACEPTADO" && (
                            <button
                              onClick={() =>
                                cambiarEstado(pedido.id, "EN_PREPARACION")
                              }
                              disabled={actualizando === pedido.id}
                              className="bg-yellow-600 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 transition flex items-center gap-1 font-semibold text-sm whitespace-nowrap"
                            >
                              <HiOutlineClock size={16} />
                              {actualizando === pedido.id ? "..." : "Preparar"}
                            </button>
                          )}

                          {pedido.estado === "EN_PREPARACION" && (
                            <button
                              onClick={() => cambiarEstado(pedido.id, "LISTO")}
                              disabled={actualizando === pedido.id}
                              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition flex items-center gap-1 font-semibold text-sm whitespace-nowrap"
                            >
                              <HiOutlineCheck size={16} />
                              {actualizando === pedido.id ? "..." : "Listo"}
                            </button>
                          )}

                          {pedido.estado === "LISTO" && (
                            <button
                              onClick={() =>
                                cambiarEstado(pedido.id, "COMPLETADO")
                              }
                              disabled={actualizando === pedido.id}
                              className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 transition flex items-center gap-1 font-semibold text-sm whitespace-nowrap"
                            >
                              <HiOutlineCheck size={16} />
                              {actualizando === pedido.id ? "..." : "Entregar"}
                            </button>
                          )}

                          <button
                            onClick={() => setPedidoSeleccionado(pedido)}
                            className="bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition flex items-center gap-1 font-semibold text-sm"
                          >
                            <HiOutlineEye size={16} />
                            Ver
                          </button>

                          {pedido.estado !== "COMPLETADO" &&
                            pedido.estado !== "CANCELADO" && (
                              <button
                                onClick={() =>
                                  cambiarEstado(pedido.id, "CANCELADO")
                                }
                                disabled={actualizando === pedido.id}
                                className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition flex items-center gap-1 font-semibold text-sm whitespace-nowrap"
                              >
                                <HiOutlineX size={16} />
                                {actualizando === pedido.id
                                  ? "..."
                                  : "Cancelar"}
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal de detalle del pedido */}
        {pedidoSeleccionado && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setPedidoSeleccionado(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className={`p-6 text-white ${getEstadoColor(
                  pedidoSeleccionado.estado
                )}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">
                      Pedido #{pedidoSeleccionado.numeroPedido.split("-")[2]}
                    </h2>
                    <p className="opacity-90">
                      {formatearFecha(pedidoSeleccionado.fechaCreacion)}
                    </p>
                  </div>
                  <button
                    onClick={() => setPedidoSeleccionado(null)}
                    className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all"
                  >
                    <HiOutlineX size={24} />
                  </button>
                </div>

                <div className="bg-white bg-opacity-20 rounded-xl p-4">
                  <p className="text-sm opacity-90 mb-2">Cambiar estado:</p>
                  <select
                    value={pedidoSeleccionado.estado}
                    onChange={(e) =>
                      cambiarEstado(pedidoSeleccionado.id, e.target.value)
                    }
                    disabled={actualizando === pedidoSeleccionado.id}
                    className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-white disabled:bg-gray-300"
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="ACEPTADO">Aceptado</option>
                    <option value="EN_PREPARACION">En Preparación</option>
                    <option value="LISTO">Listo</option>
                    <option value="COMPLETADO">Completado</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {/* Información del cliente */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    Cliente
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="font-semibold text-gray-800 mb-1">
                      {pedidoSeleccionado.cliente.nombre}{" "}
                      {pedidoSeleccionado.cliente.apellidoPaterno}{" "}
                      {pedidoSeleccionado.cliente.apellidoMaterno}
                    </p>
                    <p className="text-gray-600">
                      {pedidoSeleccionado.cliente.correo}
                    </p>
                  </div>
                </div>

                {/* Detalles del pedido */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    Detalles del pedido
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    {pedidoSeleccionado.detalles.map((detalle) => (
                      <div key={detalle.id} className="flex items-center gap-4">
                        <img
                          src={getImageUrl(detalle.producto.imagen)}
                          alt={detalle.producto.nombre}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {detalle.producto.nombre}
                          </p>
                          <p className="text-sm text-gray-600">
                            Cantidad: {detalle.cantidad} × Bs{" "}
                            {parseFloat(detalle.precioUnitario).toFixed(2)}
                          </p>
                        </div>
                        <p className="font-bold text-gray-800 text-lg">
                          Bs {parseFloat(detalle.subtotal).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Información adicional */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    Información adicional
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Método de pago:</span>
                      <span className="font-semibold text-gray-800">
                        {pedidoSeleccionado.metodoPago}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo de entrega:</span>
                      <span className="font-semibold text-gray-800">
                        {pedidoSeleccionado.tipoEntrega === "LLEVAR"
                          ? "Para llevar"
                          : "Para aquí"}
                      </span>
                    </div>
                    {pedidoSeleccionado.notas && (
                      <div className="pt-2 border-t">
                        <p className="text-gray-600 text-sm mb-1">Notas:</p>
                        <p className="text-gray-800">
                          {pedidoSeleccionado.notas}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Subtotal</p>
                      <p className="text-gray-800 font-semibold">
                        Bs {parseFloat(pedidoSeleccionado.subtotal).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-3xl font-bold text-orange-600">
                        Bs {parseFloat(pedidoSeleccionado.total).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
