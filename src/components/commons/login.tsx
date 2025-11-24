import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaUser, FaEnvelope } from "react-icons/fa";
import axios from "axios";

interface FormData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  contrasena: string;
  confirmarContrasena: string;
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [correoLogin, setCorreoLogin] = useState("");
  const [contrasenaLogin, setContrasenaLogin] = useState("");
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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        correo: correoLogin,
        contrasena: contrasenaLogin,
      });

      const { usuario, token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("usuarioActual", JSON.stringify(usuario));

      if (usuario.roles.includes("Administrador")) 
        navigate("/administrator/usuarios");
      else if (usuario.roles.includes("Usuario")) 
        navigate("/articulos");
      else if (usuario.roles.includes("Cocinero")) 
        navigate("/pedidos");
      else 
        navigate("/");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (["nombre", "apellidoPaterno", "apellidoMaterno"].includes(name)) {
      const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!soloLetras.test(value)) {
        setError(`El campo ${name} solo puede contener letras`);
        return;
      } else setError("");
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleRegistro = async (e: React.FormEvent<HTMLFormElement>) => {
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
      await axios.post("http://localhost:3000/usuarios", {
        correo: formData.correo,
        contrasena: formData.contrasena,
        nombre: formData.nombre,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        rolesIds: [2],
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
        backgroundColor: "#f0f9ff" 
      }}
    >
      <div 
        className={`relative z-10 w-full ${isLogin ? "max-w-md" : "max-w-4xl"} bg-white/50 backdrop-blur-sm border-4 border-black-900 shadow-2xl p-8 my-6`} 
        style={{ borderRadius: "2px" }}
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-black-900 mb-2">
            {isLogin ? "INICIAR SESIÓN" : "REGISTRO DE USUARIOS"}
          </h2>
          <div className="w-16 h-1 bg-cyan-600 mx-auto"></div>
        </div>

        {error && (
        <div className="mb-6 bg-red-100 border-l-4 border-red-600 p-3 text-red-800 font-semibold">
          {error}
        </div>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <div className="flex items-center border-b-4 border-cyan-600 pb-3 bg-transparent">
                <MdOutlineMailOutline className="text-3xl text-cyan-600 mr-4 flex-shrink-0" />
                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
                  value={correoLogin}
                  onChange={(e) => setCorreoLogin(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center border-b-4 border-cyan-600 pb-3 bg-transparent">
                <RiLockPasswordLine className="text-3xl text-cyan-600 mr-4 flex-shrink-0" />
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
                  value={contrasenaLogin}
                  onChange={(e) => setContrasenaLogin(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-cyan-600 text-white px-8 py-3 border-2 border-cyan-700 hover:bg-cyan-700 hover:shadow-lg transition-all font-bold text-lg disabled:bg-gray-400 disabled:border-gray-500"
                style={{ borderRadius: "2px" }}
              >
                {loading ? "CARGANDO..." : "ENTRAR"}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t-2 border-black-900 text-center">
              <p className="text-black-900 font-semibold">
                ¿No tienes cuenta?
                <button onClick={() => setIsLogin(false)} className="text-cyan-600 hover:text-cyan-700 font-bold ml-2 hover:underline">
                  Regístrate aquí
                </button>
              </p>
            </div>
          </form>
        ) : (
          <>
            <form 
              onSubmit={handleRegistro} 
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
                  name="apellidoPaterno" 
                  value={formData.apellidoPaterno} 
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
                  name="apellidoMaterno" 
                  value={formData.apellidoMaterno} 
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
                  name="correo" 
                  value={formData.correo} 
                  onChange={handleChange} 
                  className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium" 
                  required 
                />
              </div>

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

              <div className="flex items-center border-b-4 border-cyan-600 pb-3">
                <RiLockPasswordLine className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
                <input 
                  type="password" 
                  placeholder="Confirme Contraseña" 
                  name="confirmarContrasena" value={formData.confirmarContrasena} 
                  onChange={handleChange} 
                  className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium" 
                  required 
                />
              </div>

              <div className="md:col-span-2 flex justify-center pt-4">
                <button type="submit" disabled={loading} className="bg-cyan-600 text-gray-50 px-8 py-3 border-2 border-cyan-700 hover:bg-cyan-700 hover:shadow-lg transition-all font-bold text-lg disabled:opacity-50" style={{ borderRadius: "2px" }}>
                  {loading ? "Registrando..." : "REGISTRARSE"}
                </button>
              </div>
            </form>


            <div className="w-full flex justify-center mt-6">
              <p className="text-black-900 font-semibold text-center">
                ¿Ya tienes cuenta?
                <button onClick={() => setIsLogin(true)} className="text-cyan-600 hover:text-cyan-700 font-bold hover:underline ml-2">
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
