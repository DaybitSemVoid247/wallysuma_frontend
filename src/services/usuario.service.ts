// src/services/usuario.service.ts
import api from "../config/api";
import type { Language } from "../types/translations";

export interface Usuario {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  roles: string[];
  idiomaPreferido: Language;
}

export interface ActualizarIdiomaResponse {
  id: number;
  idiomaPreferido: Language;
}

/**
 * Servicio para gestionar usuarios
 */
export const usuarioService = {
  /**
   * Actualiza el idioma preferido de un usuario
   * @param id - ID del usuario
   * @param idioma - Código del idioma (es, en, ay)
   */
  async actualizarIdioma(
    id: number,
    idioma: Language
  ): Promise<ActualizarIdiomaResponse> {
    try {
      const response = await api.patch<ActualizarIdiomaResponse>(
        `/usuarios/${id}/idioma`,
        { idioma }
      );

      console.log(`✅ Idioma actualizado en backend: ${idioma}`);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error al actualizar idioma:", error);
      throw new Error(
        error.response?.data?.message || "Error al actualizar idioma"
      );
    }
  },

  /**
   * Obtiene el usuario actual del localStorage
   */
  getUsuarioActual(): Usuario | null {
    try {
      const usuarioStr = localStorage.getItem("usuarioActual");
      if (!usuarioStr) return null;

      return JSON.parse(usuarioStr);
    } catch (error) {
      console.error("Error al obtener usuario actual:", error);
      return null;
    }
  },

  /**
   * Actualiza el usuario en localStorage
   */
  actualizarUsuarioLocal(usuario: Partial<Usuario>): void {
    try {
      const usuarioActual = this.getUsuarioActual();
      if (!usuarioActual) return;

      const usuarioActualizado = { ...usuarioActual, ...usuario };
      localStorage.setItem("usuarioActual", JSON.stringify(usuarioActualizado));

      console.log("✅ Usuario actualizado en localStorage");
    } catch (error) {
      console.error("Error al actualizar usuario local:", error);
    }
  },
};

export default usuarioService;
