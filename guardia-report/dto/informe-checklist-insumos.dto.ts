// guardia-report/dto/informe-checklist-insumos.dto.ts
import { IsString, IsArray, ValidateNested, IsBoolean, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemInsumoDto {
  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsString()
  @IsNotEmpty()
  especificacion: string;

  @IsNumber()
  cantidad: number;

  @IsString()
  @IsNotEmpty()
  observacion: string;

  @IsBoolean()
  deficit: boolean;

  @IsBoolean()
  @IsOptional()
  esPrimera?: boolean;

  @IsNumber()
  @IsOptional()
  rowspan?: number;
}

export class GabineteInsumosDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemInsumoDto)
  items: ItemInsumoDto[];
}

export class PersonaFirmaInsumosDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  cargo: string;
}

export class InformeChecklistInsumosDto {
  @IsString()
  @IsNotEmpty()
  division: string;

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
  jefeGuardia: string;

  @IsString()
  @IsNotEmpty()
  tum: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GabineteInsumosDto)
  gabinetes: GabineteInsumosDto[];

  @IsString()
  notas: string;

  @ValidateNested()
  @Type(() => PersonaFirmaInsumosDto)
  entrega: PersonaFirmaInsumosDto;

  @ValidateNested()
  @Type(() => PersonaFirmaInsumosDto)
  recibe: PersonaFirmaInsumosDto;
}