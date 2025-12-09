// src/components/translations/types.ts

export type TipoEntidad = "producto" | "categoria" | "subcategoria";
export type Idioma = "es" | "en" | "ay";
export type CampoTraducible = "nombre" | "descripcion";

export interface TraduccionFormData {
  nombre: string;
  descripcion: string;
}

export interface TraduccionesData {
  en: TraduccionFormData;
  ay: TraduccionFormData;
}

export interface TranslationModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  entidad: TipoEntidad;
  entidadId: number;
  nombreOriginal: string;
  descripcionOriginal?: string;
}

export interface TraduccionBackend {
  id: number;
  entidad: string;
  entidadId: number;
  idioma: Idioma;
  campo: CampoTraducible;
  valor: string;
}

export interface CrearTraduccionMasivaDto {
  entidad: string;
  entidadId: number;
  idioma: Idioma;
  campos: {
    campo: CampoTraducible;
    valor: string;
  }[];
}
