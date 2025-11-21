import { useState, useEffect } from "react";
import { HiOutlineTrash, HiOutlinePencil, HiOutlinePlus } from "react-icons/hi";

interface Usuario {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  ci: string;
  telefono: string;
  correo: string;
  contrasena: string;
}

export const UsuariosTable = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    ci: "",
    telefono: "",
    correo: "",
    contrasena: "",
  });

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const res = await fetch("http://localhost:3000/usuarios");
        const data = await res.json();
        setUsuarios(data);
      } catch (error) {
        console.log("Error cargando usuarios", error);
      }
    };

    cargarUsuarios();
  }, []);

  // ================================
  // 🔥 2. AGREGAR USUARIO
  // ================================
  const handleAdd = () => {
    setEditingId(null);
    setForm({
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      ci: "",
      telefono: "",
      correo: "",
      contrasena: "",
    });
    setShowModal(true);
  };

  // ================================
  // 🔥 3. EDITAR USUARIO (llenado de modal)
  // ================================
  const handleEdit = (usuario: Usuario) => {
    setEditingId(usuario.id);
    setForm({
      nombre: usuario.nombre,
      apellidoPaterno: usuario.apellidoPaterno,
      apellidoMaterno: usuario.apellidoMaterno,
      ci: usuario.ci,
      telefono: usuario.telefono,
      correo: usuario.correo,
      contrasena: "", // no mostramos hash
    });
    setShowModal(true);
  };

  // ================================
  // 🔥 5. GUARDAR USUARIO (POST/PUT)
  // ================================
  const handleSave = () => {
    const url = editingId
      ? `http://localhost:3000/usuarios/${editingId}`
      : "http://localhost:3000/usuarios";

    const method = editingId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((usuarioGuardado) => {
        if (editingId) {
          // Actualizar lista
          setUsuarios(
            usuarios.map((u) => (u.id === editingId ? usuarioGuardado : u))
          );
        } else {
          // Agregar nuevo
          setUsuarios([...usuarios, usuarioGuardado]);
        }

        setShowModal(false);
      })
      .catch((err) => console.error("Error guardando usuario:", err));
  };

  // ================================
  // UI
  // ================================
  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Usuarios</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#d88c6f] text-white px-4 py-2 rounded hover:bg-[#9e4e2f]"
        >
          <HiOutlinePlus size={18} />
          Agregar
        </button>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-200 font-semibold">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Ap. Paterno</th>
              <th className="px-6 py-3">Ap. Materno</th>
              <th className="px-6 py-3">Usuario</th>
              <th className="px-6 py-3">Correo</th>
              <th className="px-6 py-3">CI</th>
              <th className="px-6 py-3">Teléfono</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="border-b">
                <td className="px-6 py-3">{usuario.nombre}</td>
                <td className="px-6 py-3">{usuario.apellidoPaterno}</td>
                <td className="px-6 py-3">{usuario.apellidoMaterno}</td>
                <td className="px-6 py-3">{usuario.correo}</td>
                <td className="px-6 py-3">{usuario.ci || "-"}</td>
                <td className="px-6 py-3">{usuario.telefono || "-"}</td>

                <td className="px-6 py-3 text-center">
                  <button
                    onClick={() => handleEdit(usuario)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    <HiOutlinePencil size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        >
          <div className="rounded-lg p-6 w-full max-w-xl bg-white shadow-xl">
            <h3 className="text-lg font-bold mb-4">
              {editingId ? "Editar Usuario" : "Nuevo Usuario"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {/** CAMPOS **/}

              <input
                type="text"
                placeholder="Nombre"
                className="input"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />

              <input
                type="text"
                placeholder="Apellido Paterno"
                className="input"
                value={form.apellidoPaterno}
                onChange={(e) =>
                  setForm({ ...form, apellidoPaterno: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Apellido Materno"
                className="input"
                value={form.apellidoMaterno}
                onChange={(e) =>
                  setForm({ ...form, apellidoMaterno: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Correo"
                className="input"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
              />

              <input
                type="text"
                placeholder="CI"
                className="input"
                value={form.ci}
                onChange={(e) => setForm({ ...form, ci: e.target.value })}
              />

              <input
                type="text"
                placeholder="Teléfono"
                className="input"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />

              <input
                type="password"
                placeholder="Contraseña"
                className="input md:col-span-2"
                value={form.contrasena}
                onChange={(e) =>
                  setForm({ ...form, contrasena: e.target.value })
                }
              />
            </div>

            <div className="flex gap-2">
              <button
                className="flex-1 px-3 py-2 border rounded"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>

              <button
                className="flex-1 px-3 py-2 bg-[#d88c6f] text-white rounded hover:bg-[#9e4e2f]"
                onClick={handleSave}
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

export default UsuariosTable;
