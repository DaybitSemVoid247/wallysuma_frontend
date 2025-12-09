// src/components/LanguageSelector.tsx
import { useState } from "react";
import { HiOutlineGlobe } from "react-icons/hi";
import { useLanguage } from "../hooks/useLanguage";
import { LANGUAGES } from "../types/translations";
import type { Language } from "../types/translations";

export const LanguageSelector = () => {
  const { language, changeLanguage, isLoading } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  // Obtener información del idioma actual
  const currentLang =
    LANGUAGES.find((lang) => lang.code === language) || LANGUAGES[0];

  // ⭐ CORREGIDO: Ahora es async y espera el cambio de idioma
  const handleChangeLanguage = async (code: Language) => {
    try {
      setIsChanging(true);

      // ⭐ IMPORTANTE: Agregar await para esperar la promesa
      await changeLanguage(code);

      console.log(`✅ Idioma cambiado exitosamente a: ${code}`);
      setIsOpen(false);
    } catch (error) {
      console.error("❌ Error al cambiar idioma:", error);
      alert("Error al cambiar idioma. Intenta nuevamente.");
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="relative">
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading || isChanging}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#d4c7b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Seleccionar idioma"
      >
        <HiOutlineGlobe size={20} />
        <span className="text-xl" role="img" aria-label={currentLang.name}>
          {currentLang.flag}
        </span>

        {/* Indicador de carga */}
        {(isLoading || isChanging) && (
          <div className="ml-1 animate-spin rounded-full h-3 w-3 border-b-2 border-gray-700"></div>
        )}
      </button>

      {/* Dropdown de idiomas */}
      {isOpen && (
        <>
          {/* Overlay para cerrar al hacer click fuera */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menú de opciones */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border py-2 z-50">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleChangeLanguage(lang.code)}
                disabled={isChanging || language === lang.code}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  language === lang.code ? "bg-[#f5efe7] font-semibold" : ""
                }`}
                aria-label={`Cambiar a ${lang.name}`}
              >
                <span className="text-xl" role="img" aria-label={lang.name}>
                  {lang.flag}
                </span>
                <div className="flex flex-col flex-1">
                  <span className="text-sm">{lang.name}</span>
                  <span className="text-xs text-gray-500">
                    {lang.nativeName}
                  </span>
                </div>

                {/* Checkmark para idioma actual */}
                {language === lang.code && (
                  <span className="text-green-600 text-lg">✓</span>
                )}

                {/* Spinner mientras cambia */}
                {isChanging && language !== lang.code && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
