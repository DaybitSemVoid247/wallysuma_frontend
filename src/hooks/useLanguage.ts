// src/hooks/useLanguage.ts
import { useLanguageContext } from "../contexts/LanguageContext";

/**
 * Hook simplificado para acceder al idioma actual y cambiar idioma
 *
 * @example
 * ```tsx
 * const { language, changeLanguage } = useLanguage();
 *
 * // Obtener idioma actual
 * console.log(language); // 'es', 'en', o 'ay'
 *
 * // Cambiar idioma
 * changeLanguage('ay');
 * ```
 */
export const useLanguage = () => {
  return useLanguageContext();
};

export default useLanguage;
