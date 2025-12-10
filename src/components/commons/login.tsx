// src/components/commons/login.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // ⭐ USAR
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaUser, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { useLanguage } from "../../hooks/useLanguage";
import { LanguageSelector } from "../LanguageSelector"; // ⭐ IMPORTAR
import type { Language } from "../../types/translations";

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
  const { t } = useTranslation(); // ⭐ USAR TRADUCCIONES
  const { changeLanguage } = useLanguage();

  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [correoLogin, setCorreoLogin] = useState("");
  const [contrasenaLogin, setContrasenaLogin] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [correoVerificacion, setCorreoVerificacion] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

      if (usuario.idiomaPreferido) {
        try {
          await changeLanguage(usuario.idiomaPreferido as Language);
          console.log(`✅ Idioma aplicado: ${usuario.idiomaPreferido}`);
        } catch (langError) {
          console.warn("⚠️ Error al cambiar idioma:", langError);
        }
      }

      const rutasPorRol: Record<string, string> = {
        Administrador: "/administrator/estadisticas",
        Usuario: "/",
        Cocinero: "/pedidos",
        Cajero: "/cajero",
      };

      const rolAsignado = usuario.roles.find((rol: string) => rutasPorRol[rol]);

      if (rolAsignado) {
        navigate(rutasPorRol[rolAsignado]);
      } else {
        navigate("/");
      }
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.response?.data?.message || t("errorServerConnection"));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (["nombre", "apellidoPaterno", "apellidoMaterno"].includes(name)) {
      const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!soloLetras.test(value)) {
        setError(t("errorOnlyLetters", { field: name }));
        return;
      } else setError("");
    }

    setFormData({ ...formData, [name]: value });
  };

  const verificarCodigo = async () => {
    if (!codigo.trim()) {
      setError(t("errorEnterCode"));
      return;
    }

    try {
      await axios.post("http://localhost:3000/usuarios/verificar-codigo", {
        correo: correoVerificacion,
        codigo: codigo,
      });

      setShowModal(false);
      setCodigo("");
      setError("");
      setShowSuccessModal(true);
      setIsLogin(true);
    } catch (err: any) {
      setError(err.response?.data?.message || t("errorVerifyingCode"));
    }
  };

  const handleRegistro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!soloLetras.test(formData.nombre)) {
      setError(t("errorOnlyLetters", { field: "nombre" }));
      return;
    }
    if (!soloLetras.test(formData.apellidoPaterno)) {
      setError(t("errorOnlyLetters", { field: "apellidoPaterno" }));
      return;
    }
    if (!soloLetras.test(formData.apellidoMaterno)) {
      setError(t("errorOnlyLetters", { field: "apellidoMaterno" }));
      return;
    }
    if (formData.contrasena.length < 6) {
      setError(t("errorMinPassword"));
      return;
    }
    if (formData.contrasena !== formData.confirmarContrasena) {
      setError(t("errorPasswordMismatch"));
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

      setCorreoVerificacion(formData.correo);
      setShowModal(true);

      setFormData({
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        correo: "",
        contrasena: "",
        confirmarContrasena: "",
      });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || t("errorServerConnection"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modal de Éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-gradient-to-br from-white to-cyan-50 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border-4 border-cyan-600">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4 text-cyan-700">
              {t("accountVerifiedTitle")}
            </h2>

            <p className="text-gray-700 mb-6 text-lg">
              {t("accountVerifiedMessage")}
              <br />
              <span className="font-semibold text-cyan-600">
                {t("nowCanLogin")}
              </span>
            </p>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                setIsLogin(true);
              }}
              className="w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              {t("acceptButton")}
            </button>
          </div>
        </div>
      )}

      {/* Modal de Verificación */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center border-4 border-cyan-600">
            <h2 className="text-2xl font-bold mb-4 text-cyan-700">
              {t("emailVerificationTitle")}
            </h2>

            <p className="text-gray-700 mb-4">
              {t("emailVerificationMessage")}
              <br />
              <strong>{correoVerificacion}</strong>
            </p>

            {error && (
              <p className="text-red-600 font-semibold mb-2">{error}</p>
            )}

            <input
              type="text"
              maxLength={6}
              placeholder={t("verificationCodePlaceholder")}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full border-2 border-cyan-600 p-2 rounded mb-4 text-center text-xl tracking-widest"
            />

            <button
              onClick={verificarCodigo}
              className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 font-semibold"
            >
              {t("verifyCodeButton")}
            </button>

            <button
              onClick={() => {
                setShowModal(false);
                setError("");
                setCodigo("");
              }}
              className="mt-3 text-gray-600 hover:underline"
            >
              {t("cancelButton")}
            </button>
          </div>
        </div>
      )}

      {/* Formulario Principal */}
      <div
        className="w-full min-h-screen flex items-center justify-center p-6 overflow-auto bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/public/wallysuma.png')" }}
      >
        <div className="absolute inset-0 bg-[#FFA07A]/10 backdrop-blur-sm"></div>

        {/* ⭐ SELECTOR DE IDIOMA (flotante arriba a la derecha) */}
        <div className="fixed top-4 right-4 z-50">
          <LanguageSelector />
        </div>

        <div
          className={`relative z-10 w-full ${
            isLogin ? "max-w-md" : "max-w-4xl"
          } 
          bg-white/50 backdrop-blur-sm border-4 border-black-900 shadow-2xl p-8 my-6`}
          style={{ borderRadius: "16px" }}
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-black-900 mb-2">
              {isLogin ? t("loginTitle") : t("registerTitle")}
            </h2>
            <div className="w-16 h-1 bg-cyan-600 mx-auto"></div>
          </div>

          {error && !showModal && (
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
                    placeholder={t("email")}
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
                    placeholder={t("password")}
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
                  style={{ borderRadius: "16px" }}
                >
                  {loading ? t("loadingButton") : t("loginButton")}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t-2 border-black-900 text-center">
                <p className="text-black-900 font-semibold">
                  {t("dontHaveAccount")}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false);
                      setError("");
                    }}
                    className="text-cyan-600 hover:text-cyan-700 font-bold ml-2 hover:underline"
                  >
                    {t("registerHere")}
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
                    placeholder={t("firstName")}
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
                    placeholder={t("lastName")}
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
                    placeholder={t("motherLastName")}
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
                    placeholder={t("email")}
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
                    placeholder={t("password")}
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
                    placeholder={t("confirmPassword")}
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
                    {loading ? t("registeringButton") : t("registerButton")}
                  </button>
                </div>
              </form>

              <div className="w-full flex justify-center mt-6">
                <p className="text-black-900 font-semibold text-center">
                  {t("alreadyHaveAccount")}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setError("");
                    }}
                    className="text-cyan-600 hover:text-cyan-700 font-bold hover:underline ml-2"
                  >
                    {t("loginHere")}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
