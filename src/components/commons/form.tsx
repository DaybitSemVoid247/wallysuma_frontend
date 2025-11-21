import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import axios from "axios";

interface FormData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  contrasena: string;
  confirmarContrasena: string;
}

export default function RegistroUsuarios() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Validar que nombre y apellidos solo contengan letras y espacios
    if (["nombre", "apellidoPaterno", "apellidoMaterno"].includes(name)) {
      const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!soloLetras.test(value)) {
        setError(`El campo ${name} solo puede contener letras`);
        return;
      } else {
        setError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validaciones
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!soloLetras.test(formData.nombre)) {
      setError("El nombre solo puede contener letras");
      return;
    }
    if (!soloLetras.test(formData.apellidoPaterno)) {
      setError("El apellido paterno solo puede contener letras");
      return;
    }
    if (!soloLetras.test(formData.apellidoMaterno)) {
      setError("El apellido materno solo puede contener letras");
      return;
    }
    if (formData.contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (formData.contrasena !== formData.confirmarContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);

      const API_URL = "http://localhost:3000/usuarios";
      await axios.post(API_URL, {
        correo: formData.correo, // correo principal
        contrasena: formData.contrasena, // contraseña
        nombre: formData.nombre,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        rolesIds: [2], // rol Usuario
      });

      setFormData({
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        correo: "",
        contrasena: "",
        confirmarContrasena: "",
      });

      alert("¡Registrado exitosamente! Ahora inicia sesión");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error al conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
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
          {/* Nombre */}
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

          {/* Apellido Paterno */}
          <div className="flex items-center border-b-4 border-cyan-600 pb-3">
            <FaUser className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Apellido Paterno"
              name="apellidoPaterno"
              value={formData.apellidoPaterno}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
              required
            />
          </div>

          {/* Apellido Materno */}
          <div className="flex items-center border-b-4 border-cyan-600 pb-3">
            <FaUser className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Apellido Materno"
              name="apellidoMaterno"
              value={formData.apellidoMaterno}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
              required
            />
          </div>

          {/* Correo */}
          <div className="flex items-center border-b-4 border-cyan-600 pb-3">
            <FaEnvelope className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
            <input
              type="email"
              placeholder="Correo Electrónico"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
              required
            />
          </div>

          {/* Contraseña */}
          <div className="flex items-center border-b-4 border-cyan-600 pb-3">
            <RiLockPasswordLine className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
            <input
              type="password"
              placeholder="Contraseña"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
              required
            />
          </div>

          {/* Confirmar Contraseña */}
          <div className="flex items-center border-b-4 border-cyan-600 pb-3">
            <RiLockPasswordLine className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
            <input
              type="password"
              placeholder="Confirme Contraseña"
              name="confirmarContrasena"
              value={formData.confirmarContrasena}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
              required
            />
          </div>

          <div className="md:col-span-2 flex justify-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-600 text-gray-50 px-8 py-3 border-2 border-cyan-700 hover:bg-cyan-700 hover:shadow-lg transition-all font-bold text-lg disabled:opacity-50"
              style={{ borderRadius: "2px" }}
            >
              {loading ? "Registrando..." : "REGISTRARSE"}
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
