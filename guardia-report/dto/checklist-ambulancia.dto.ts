// guardia-report/dto/checklist-ambulancia.dto.ts
import { IsString, IsArray, ValidateNested, IsEnum, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class IncidenciaChecklistDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsEnum(['satisfactorio', 'regular', 'malo'])
  estado: 'satisfactorio' | 'regular' | 'malo';

  @IsString()
  @IsNotEmpty()
  estadoTexto: string;
}

export class ItemChecklistDto {
  @IsString()
  @IsNotEmpty()
  numero: number;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncidenciaChecklistDto)
  incidencias: IncidenciaChecklistDto[];
}

export class PersonaFirmaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  cargo: string;
}

export class ChecklistAmbulanciaDto {
  @IsString()
  @IsNotEmpty()
  ambulancia: string;

  @IsString()
  @IsNotEmpty()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  hora: string;

  @IsString()
  @IsNotEmpty()
  kilometraje: string;

  @IsString()
  @IsNotEmpty()
  valeGas: string;

  @IsString()
  @IsNotEmpty()
  jefeGuardia: string;

  @IsString()
  @IsNotEmpty()
  operador: string;

  @IsString()
  @IsNotEmpty()
  tum: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemChecklistDto)
  items: ItemChecklistDto[];

  @IsString()
  notas: string;

  @ValidateNested()
  @Type(() => PersonaFirmaDto)
  entrega: PersonaFirmaDto;

  @ValidateNested()
  @Type(() => PersonaFirmaDto)
  recibe: PersonaFirmaDto;
}