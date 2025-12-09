// src/types/translations.ts

// Idiomas soportados
export type Language = "es" | "en" | "ay";

// Información de cada idioma
export interface LanguageInfo {
  code: Language;
  name: string;
  flag: string;
  nativeName: string;
}

// Configuración de idiomas disponibles
export const LANGUAGES: LanguageInfo[] = [
  {
    code: "es",
    name: "Español",
    flag: "🇪🇸",
    nativeName: "Español",
  },
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
    nativeName: "English",
  },
  {
    code: "ay",
    name: "Aymara",
    flag: "🇧🇴",
    nativeName: "Aymara",
  },
];

// Idioma por defecto
export const DEFAULT_LANGUAGE: Language = "es";

// Key para localStorage
export const LANGUAGE_STORAGE_KEY = "app-language";

// Tipos de entidades que soportan traducción
export enum TipoEntidad {
  PRODUCTO = "producto",
  CATEGORIA = "categoria",
  SUBCATEGORIA = "subcategoria",
  ESTADO_PEDIDO = "estado_pedido",
  ROL = "rol",
  MENSAJE_ERROR = "mensaje_error",
}

// Campos traducibles
export enum CampoTraducible {
  NOMBRE = "nombre",
  DESCRIPCION = "descripcion",
}

// Interfaz para traducciones del backend
export interface Traduccion {
  id: number;
  entidad: TipoEntidad;
  entidadId: number;
  idioma: Language;
  campo: CampoTraducible;
  valor: string;
  creadoEn?: Date;
  actualizadoEn?: Date;
}

// DTO para crear traducción
export interface CrearTraduccionDto {
  entidad: TipoEntidad;
  entidadId: number;
  idioma: Language;
  campo: CampoTraducible;
  valor: string;
}

// Utilidad para validar idioma
export const isValidLanguage = (lang: string): lang is Language => {
  return ["es", "en", "ay"].includes(lang);
};

// Utilidad para obtener info de idioma
export const getLanguageInfo = (code: Language): LanguageInfo | undefined => {
  return LANGUAGES.find((lang) => lang.code === code);
};
