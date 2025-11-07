// guardia-report/interfaces/informe-checklist-insumos.interface.ts

export interface ItemInsumo {
  categoria: string;
  especificacion: string;
  cantidad: number;
  observacion: string;
  deficit: boolean;
  esPrimera?: boolean; // Para indicar si es la primera fila de una categoría con rowspan
  rowspan?: number; // Número de filas que abarca la categoría
}

export interface GabineteInsumos {
  titulo: string;
  items: ItemInsumo[];
}

export interface PersonaFirmaInsumos {
  nombre: string;
  cargo: string;
}

export interface InformeChecklistInsumos {
  division: string;
  ambulancia: string;
  fecha: string;
  hora: string;
  jefeGuardia: string;
  tum: string;
  gabinetes: GabineteInsumos[];
  notas: string;
  entrega: PersonaFirmaInsumos;
  recibe: PersonaFirmaInsumos;
}