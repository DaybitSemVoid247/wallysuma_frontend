import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import axios from "axios";

export default function InicioSesionUsuarios() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        correo,
        contrasena,
      });

      const { usuario, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("usuarioActual", JSON.stringify(usuario));

      if (usuario.roles.includes("Administrador")) {
        navigate("/administrator/usuarios");
      } else if (usuario.roles.includes("Usuario")) {
        navigate("/articulos");
      } else if (usuario.roles.includes("Cocinero")) {
        navigate("/pedidos");
      } else {
        navigate("/");
      }
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
      className="w-full h-screen flex items-center justify-center p-6 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/public/wallysuma.png')",
        backgroundColor: "#f0f9ff",
      }}
    >
      <div
        className="relative z-10 w-full max-w-md bg-white/50 backdrop-blur-sm border-4 border-black-900 shadow-2xl p-8"
        style={{ borderRadius: "2px" }}
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-black-900 mb-2">
            INICIAR SESIÓN
          </h2>
          <div className="w-16 h-1 bg-cyan-600 mx-auto"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="flex items-center border-b-4 border-cyan-600 pb-3 bg-transparent">
              <MdOutlineMailOutline className="text-3xl text-cyan-600 mr-4 flex-shrink-0" />
              <input
                type="email"
                placeholder="Correo Electrónico"
                className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
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
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-600 p-3 text-red-800 font-semibold">
              {error}
            </div>
          )}

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
        </form>

        <div className="mt-6 pt-6 border-t-2 border-black-900 text-center">
          <p className="text-black-900 font-semibold">
            ¿No tienes cuenta?
            <button
              onClick={() => navigate("registro")}
              className="text-cyan-600 hover:text-cyan-700 font-bold ml-2 hover:underline"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
