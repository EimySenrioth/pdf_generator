// guardia-report/interfaces/checklist-ambulancia.interface.ts

export interface IncidenciaChecklist {
  descripcion: string;
  estado: 'satisfactorio' | 'regular' | 'malo';
  estadoTexto: string;
}

export interface ItemChecklist {
  numero: number;
  nombre: string;
  incidencias: IncidenciaChecklist[];
}

export interface PersonaFirma {
  nombre: string;
  cargo: string;
}

export interface ChecklistAmbulancia {
  ambulancia: string;
  fecha: string;
  hora: string;
  kilometraje: string;
  valeGas: string;
  jefeGuardia: string;
  operador: string;
  tum: string;
  items: ItemChecklist[];
  notas: string;
  entrega: PersonaFirma;
  recibe: PersonaFirma;
}