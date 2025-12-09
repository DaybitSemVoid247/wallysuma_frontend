// src/config/api.ts (VERSION MEJORADA)
import axios from "axios";

// URL base del backend
const API_BASE_URL = "http://localhost:3000";

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de REQUEST: Agrega headers automáticamente
api.interceptors.request.use(
  (config) => {
    // ⭐ 1. Agregar idioma actual
    const idioma = localStorage.getItem("app-language") || "es";
    config.headers["X-App-Language"] = idioma;

    // ⭐ 2. Agregar token JWT si existe
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Log para debugging (opcional, comentar en producción)
    console.log(
      `🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`,
      {
        idioma,
        hasToken: !!token,
      }
    );

    return config;
  },
  (error) => {
    console.error("❌ Error en request interceptor:", error);
    return Promise.reject(error);
  }
);

// Interceptor de RESPONSE: Manejo de errores global
api.interceptors.response.use(
  (response) => {
    // Log para debugging (opcional, comentar en producción)
    console.log(`✅ API Response: ${response.status}`, response.config.url);
    return response;
  },
  (error) => {
    // Manejo de errores comunes
    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url;

      console.error(`❌ API Error ${status} en ${url}:`, error.response.data);

      switch (status) {
        case 401:
          console.error("🚫 No autorizado - Token inválido o expirado");
          // Opcional: Limpiar localStorage y redirigir a login
          // localStorage.removeItem('token');
          // localStorage.removeItem('usuarioActual');
          // window.location.href = '/login';
          break;

        case 403:
          console.error("🚫 Acceso prohibido - Permisos insuficientes");
          break;

        case 404:
          console.error("🔍 Recurso no encontrado");
          break;

        case 500:
          console.error("💥 Error interno del servidor");
          break;

        default:
          console.error(`⚠️ Error HTTP ${status}`);
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error("📡 No se recibió respuesta del servidor");
      console.error("Verifica que el backend esté corriendo en:", API_BASE_URL);
    } else {
      // Algo pasó al configurar la petición
      console.error("⚙️ Error al configurar la petición:", error.message);
    }

    return Promise.reject(error);
  }
);

// Exportar instancia configurada
export default api;

// Exportar también la URL base por si se necesita
export { API_BASE_URL };
