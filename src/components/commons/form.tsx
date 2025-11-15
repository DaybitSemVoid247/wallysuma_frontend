import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoLocationSharp } from "react-icons/io5";

interface FormData {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo_electronico: string;
  fecha_nacimiento: string;
  direccion: string;
  contraseña: string;
  confirmarContraseña: string;
}

export default function RegistroUsuarios() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo_electronico: "",
    fecha_nacimiento: "",
    direccion: "",
    contraseña: "",
    confirmarContraseña: "",
  });

  useEffect(() => {
    // Prevenir scroll en el body
    document.body.style.overflow = "hidden";

    return () => {
      // Restaurar scroll cuando el componente se desmonte
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Validar que nombre y apellidos solo contengan letras y espacios
    if (
      name === "nombre" ||
      name === "apellido_paterno" ||
      name === "apellido_materno"
    ) {
      const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!soloLetras.test(value)) {
        setError(
          `El campo ${name.replace("_", " ")} solo puede contener letras`
        );
        return;
      } else {
        setError("");
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validar que los campos de nombre no tengan números
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (!soloLetras.test(formData.nombre)) {
      setError("El nombre solo puede contener letras");
      return;
    }

    if (!soloLetras.test(formData.apellido_paterno)) {
      setError("El apellido paterno solo puede contener letras");
      return;
    }

    if (!soloLetras.test(formData.apellido_materno)) {
      setError("El apellido materno solo puede contener letras");
      return;
    }

    if (formData.contraseña.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (formData.contraseña !== formData.confirmarContraseña) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const usuariosGuardados = localStorage.getItem("usuarios");
    const usuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

    // Verificar si el correo ya existe
    const correoExiste = usuarios.some(
      (user: any) => user.email === formData.correo_electronico
    );

    if (correoExiste) {
      setError("Este correo electrónico ya está registrado");
      return;
    }

    const nuevoUsuario = {
      id: Date.now(),
      nombre: formData.nombre,
      apellido_paterno: formData.apellido_paterno,
      apellido_materno: formData.apellido_materno,
      email: formData.correo_electronico,
      fecha_nacimiento: formData.fecha_nacimiento,
      direccion: formData.direccion,
      contraseña: formData.contraseña,
      rol: "Usuario",
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    setFormData({
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      correo_electronico: "",
      fecha_nacimiento: "",
      direccion: "",
      contraseña: "",
      confirmarContraseña: "",
    });

    alert("¡Registrado exitosamente! Ahora inicia sesión");
    navigate("/login");
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-6 overflow-auto bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/public/wallysuma.png')",
        backgroundColor: "#f0f9ff",
      }}
    >
      <div
        className="relative z-10 w-full max-w-4xl bg-white/50 backdrop-blur-sm border-4 border-black-900 shadow-2xl p-8 my-6"
        style={{ borderRadius: "2px" }}
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-black-900 mb-2">
            REGISTRO DE USUARIOS
          </h2>
          <div className="w-16 h-1 bg-cyan-600 mx-auto"></div>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border-l-4 border-red-600 p-3 text-red-800 font-semibold">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="flex items-center border-b-4 border-cyan-600 pb-3">
            <FaUser className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
              required
            />
          </div>

          <div className="flex items-center border-b-4 border-cyan-600 pb-3">
            <FaUser className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Apellido Paterno"
              name="apellido_paterno"
              value={formData.apellido_paterno}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
              required
            />
          </div>

          <div className="flex items-center border-b-4 border-cyan-600 pb-3">
            <FaUser className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Apellido Materno"
              name="apellido_materno"
              value={formData.apellido_materno}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
              required
            />
          </div>

          <div className="flex items-center border-b-4 border-cyan-600 pb-3">
            <FaEnvelope className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
            <input
              type="email"
              placeholder="Correo Electrónico"
              name="correo_electronico"
              value={formData.correo_electronico}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
              required
            />
          </div>

          <div className="flex items-center border-b-4 border-cyan-600 pb-3">
            <MdDateRange className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
              required
            />
          </div>

          <div className="flex items-center border-b-4 border-cyan-600 pb-3">
            <IoLocationSharp className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
              required
            />
          </div>

          <div className="flex items-center border-b-4 border-cyan-600 pb-3">
            <RiLockPasswordLine className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
            <input
              type="password"
              placeholder="Contraseña (mínimo 6 caracteres)"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
              required
            />
          </div>

          <div className="flex items-center border-b-4 border-cyan-600 pb-3">
            <RiLockPasswordLine className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
            <input
              type="password"
              placeholder="Confirme Contraseña"
              name="confirmarContraseña"
              value={formData.confirmarContraseña}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
              required
            />
          </div>

          <div className="md:col-span-2 flex justify-center pt-4">
            <button
              type="submit"
              className="bg-cyan-600 text-gray-50 px-8 py-3 border-2 border-cyan-700 hover:bg-cyan-700 hover:shadow-lg transition-all font-bold text-lg"
              style={{ borderRadius: "2px" }}
            >
              REGISTRARSE
            </button>
          </div>
        </form>

        <p className="text-center mt-8 pt-6 border-t-2 border-black-900 text-black-900 font-semibold">
          ¿Ya tienes cuenta?
          <button
            onClick={() => navigate("/login")}
            className="text-cyan-600 hover:text-cyan-700 font-bold hover:underline ml-2"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
}
