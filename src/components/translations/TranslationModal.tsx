// src/components/translations/TranslationModal.tsx
import { useState, useEffect } from "react";
import { HiOutlineGlobe, HiOutlineX } from "react-icons/hi";
import type {
  TranslationModalProps,
  TraduccionesData,
  CrearTraduccionMasivaDto,
  TraduccionBackend,
  Idioma,
} from "./types";

const API_URL = "http://localhost:3000";

export const TranslationModal = ({
  show,
  onClose,
  onSave,
  entidad,
  entidadId,
  nombreOriginal,
  descripcionOriginal = "",
}: TranslationModalProps) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [traducciones, setTraducciones] = useState<TraduccionesData>({
    en: { nombre: "", descripcion: "" },
    ay: { nombre: "", descripcion: "" },
  });

  // Cargar traducciones existentes cuando se abre el modal
  useEffect(() => {
    if (show) {
      cargarTraducciones();
    }
  }, [show, entidadId]);

  const cargarTraducciones = async () => {
    try {
      setLoading(true);
      console.log(`🔄 Cargando traducciones de ${entidad} ID ${entidadId}`);

      // Cargar traducciones para inglés
      const resEn = await fetch(
        `${API_URL}/traducciones/${entidad}/${entidadId}?idioma=en`
      );
      const dataEn: TraduccionBackend[] = resEn.ok ? await resEn.json() : [];

      // Cargar traducciones para aymara
      const resAy = await fetch(
        `${API_URL}/traducciones/${entidad}/${entidadId}?idioma=ay`
      );
      const dataAy: TraduccionBackend[] = resAy.ok ? await resAy.json() : [];

      // Procesar traducciones inglés
      const nombreEn = dataEn.find((t) => t.campo === "nombre")?.valor || "";
      const descripcionEn =
        dataEn.find((t) => t.campo === "descripcion")?.valor || "";

      // Procesar traducciones aymara
      const nombreAy = dataAy.find((t) => t.campo === "nombre")?.valor || "";
      const descripcionAy =
        dataAy.find((t) => t.campo === "descripcion")?.valor || "";

      setTraducciones({
        en: { nombre: nombreEn, descripcion: descripcionEn },
        ay: { nombre: nombreAy, descripcion: descripcionAy },
      });

      console.log("✅ Traducciones cargadas:", { en: dataEn, ay: dataAy });
    } catch (error) {
      console.error("❌ Error al cargar traducciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log("💾 Guardando traducciones...");

      // Preparar traducciones para inglés
      const traduccionesEn: CrearTraduccionMasivaDto = {
        entidad,
        entidadId,
        idioma: "en" as Idioma,
        campos: [],
      };

      if (traducciones.en.nombre.trim()) {
        traduccionesEn.campos.push({
          campo: "nombre",
          valor: traducciones.en.nombre.trim(),
        });
      }

      if (traducciones.en.descripcion.trim()) {
        traduccionesEn.campos.push({
          campo: "descripcion",
          valor: traducciones.en.descripcion.trim(),
        });
      }

      // Preparar traducciones para aymara
      const traduccionesAy: CrearTraduccionMasivaDto = {
        entidad,
        entidadId,
        idioma: "ay" as Idioma,
        campos: [],
      };

      if (traducciones.ay.nombre.trim()) {
        traduccionesAy.campos.push({
          campo: "nombre",
          valor: traducciones.ay.nombre.trim(),
        });
      }

      if (traducciones.ay.descripcion.trim()) {
        traduccionesAy.campos.push({
          campo: "descripcion",
          valor: traducciones.ay.descripcion.trim(),
        });
      }

      // Enviar al backend
      const promises = [];

      if (traduccionesEn.campos.length > 0) {
        promises.push(
          fetch(`${API_URL}/traducciones/masivo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(traduccionesEn),
          })
        );
      }

      if (traduccionesAy.campos.length > 0) {
        promises.push(
          fetch(`${API_URL}/traducciones/masivo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(traduccionesAy),
          })
        );
      }

      if (promises.length === 0) {
        alert("No hay traducciones para guardar");
        return;
      }

      await Promise.all(promises);

      console.log("✅ Traducciones guardadas correctamente");
      alert("Traducciones guardadas correctamente");
      onSave();
      onClose();
    } catch (error) {
      console.error("❌ Error al guardar traducciones:", error);
      alert("Error al guardar las traducciones");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Resetear formulario
    setTraducciones({
      en: { nombre: "", descripcion: "" },
      ay: { nombre: "", descripcion: "" },
    });
    onClose();
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      onClick={handleCancel}
    >
      <div
        className="rounded-lg p-6 w-full max-w-2xl border-2 border-slate-300 shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <HiOutlineGlobe size={28} className="text-[#d88c6f]" />
            <h3 className="text-2xl font-bold text-slate-800">
              Traducir {entidad}
            </h3>
          </div>
          <button
            onClick={handleCancel}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <HiOutlineX size={24} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d88c6f] mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando traducciones...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Texto original en español */}
            <div className="bg-slate-100 rounded-lg p-4 border-2 border-slate-300">
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span className="text-xl">🇪🇸</span>
                Español (Original)
              </h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={nombreOriginal}
                    disabled
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-500 cursor-not-allowed"
                  />
                </div>
                {descripcionOriginal && (
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={descripcionOriginal}
                      disabled
                      rows={2}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-500 cursor-not-allowed resize-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Inglés */}
            <div className="bg-white rounded-lg p-4 border-2 border-slate-300">
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span className="text-xl">🇺🇸</span>
                English
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Product name in English"
                    value={traducciones.en.nombre}
                    onChange={(e) =>
                      setTraducciones({
                        ...traducciones,
                        en: { ...traducciones.en, nombre: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d88c6f] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Description in English"
                    value={traducciones.en.descripcion}
                    onChange={(e) =>
                      setTraducciones({
                        ...traducciones,
                        en: { ...traducciones.en, descripcion: e.target.value },
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d88c6f] bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Aymara */}
            <div className="bg-white rounded-lg p-4 border-2 border-slate-300">
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span className="text-xl">🇧🇴</span>
                Aymara
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Suti (Nombre)
                  </label>
                  <input
                    type="text"
                    placeholder="Sutipa aymara aru"
                    value={traducciones.ay.nombre}
                    onChange={(e) =>
                      setTraducciones({
                        ...traducciones,
                        ay: { ...traducciones.ay, nombre: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d88c6f] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Qhanañchawi (Descripción)
                  </label>
                  <textarea
                    placeholder="Qhanañchawipa aymara aru"
                    value={traducciones.ay.descripcion}
                    onChange={(e) =>
                      setTraducciones({
                        ...traducciones,
                        ay: { ...traducciones.ay, descripcion: e.target.value },
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d88c6f] bg-white resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCancel}
            disabled={saving}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex-1 px-4 py-2 bg-[#d88c6f] text-white rounded-lg hover:bg-[#9e4e2f] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Guardando..." : "Guardar Traducciones"}
          </button>
        </div>
      </div>
    </div>
  );
};
