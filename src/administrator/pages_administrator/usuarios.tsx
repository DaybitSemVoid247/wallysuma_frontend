import { useState, useEffect } from "react";
import { HiOutlineTrash, HiOutlinePencil, HiOutlinePlus } from "react-icons/hi";

interface Usuario {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  contrasena: string;
  roles?: Rol[];
}

interface Rol {
  id: number;
  nombre: string;
}

export const UsuariosTable = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [rolesSeleccionados, setRolesSeleccionados] = useState<number[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
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

    const cargarRoles = async () => {
      try {
        const res = await fetch("http://localhost:3000/roles");
        const data = await res.json();
        setRoles(data);
      } catch (error) {
        console.log("Error cargando roles", error);
      }
    };

    cargarUsuarios();
    cargarRoles();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    setForm({
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      correo: "",
      contrasena: "",
    });
    setRolesSeleccionados([]);
    setShowModal(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingId(usuario.id);
    setForm({
      nombre: usuario.nombre,
      apellidoPaterno: usuario.apellidoPaterno,
      apellidoMaterno: usuario.apellidoMaterno,
      correo: usuario.correo,
      contrasena: "",
    });
    setRolesSeleccionados(usuario.roles?.map((r) => r.id) || []);
    setShowModal(true);
  };

  const handleSave = () => {
    const url = editingId
      ? `http://localhost:3000/usuarios/${editingId}`
      : "http://localhost:3000/usuarios";

    const method = editingId ? "PUT" : "POST";
    const body = { ...form, rolesIds: rolesSeleccionados };

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((usuarioGuardado) => {
        if (editingId) {
          setUsuarios(
            usuarios.map((u) => (u.id === editingId ? usuarioGuardado : u))
          );
        } else {
          setUsuarios([...usuarios, usuarioGuardado]);
        }
        setShowModal(false);
      })
      .catch((err) => console.error("Error guardando usuario:", err));
  };

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
              <th className="px-6 py-3">Correo</th>
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
                type="password"
                placeholder="Contraseña"
                className="input md:col-span-2"
                value={form.contrasena}
                onChange={(e) =>
                  setForm({ ...form, contrasena: e.target.value })
                }
              />

              <div className="md:col-span-2">
                <label className="block mb-1 font-semibold">Roles:</label>
                <select
                  multiple
                  value={rolesSeleccionados.map(String)}
                  onChange={(e) => {
                    const selected = Array.from(
                      e.target.selectedOptions,
                      (option) => Number(option.value)
                    );
                    setRolesSeleccionados(selected);
                  }}
                  className="w-full border p-2 rounded"
                >
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
              </div>
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
