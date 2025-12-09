// src/contexts/LanguageContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import {
  type Language,
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  isValidLanguage,
} from "../types/translations";

// Definir el tipo del contexto
interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
  isLoading: boolean;
}

// Crear el contexto
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Props del Provider
interface LanguageProviderProps {
  children: ReactNode;
}

// Provider del contexto
export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializar idioma al cargar la aplicación
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Intentar obtener idioma guardado
        const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

        // Validar idioma guardado
        if (savedLanguage && isValidLanguage(savedLanguage)) {
          await i18n.changeLanguage(savedLanguage);
          setLanguage(savedLanguage);
        } else {
          // Si no hay idioma guardado o no es válido, usar el predeterminado
          await i18n.changeLanguage(DEFAULT_LANGUAGE);
          setLanguage(DEFAULT_LANGUAGE);
          localStorage.setItem(LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE);
        }
      } catch (error) {
        console.error("Error al inicializar idioma:", error);
        // En caso de error, usar idioma predeterminado
        setLanguage(DEFAULT_LANGUAGE);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLanguage();
  }, [i18n]);

  // Función para cambiar idioma
  const changeLanguage = async (newLanguage: Language) => {
    try {
      setIsLoading(true);

      // ⭐ 1. PRIMERO actualizar estado (esto dispara re-renders)
      setLanguage(newLanguage);

      // ⭐ 2. Guardar en localStorage (para que interceptor lo lea)
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);

      // ⭐ 3. Cambiar idioma en i18next (para UI)
      await i18n.changeLanguage(newLanguage);

      console.log(`✅ Idioma cambiado a: ${newLanguage}`);
    } catch (error) {
      console.error("❌ Error al cambiar idioma:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: LanguageContextType = {
    language,
    changeLanguage,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useLanguageContext = () => {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error(
      "useLanguageContext debe ser usado dentro de un LanguageProvider"
    );
  }

  return context;
};

export default LanguageContext;
