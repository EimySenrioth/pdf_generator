// guardia-report/dto/guardia.dto.ts
export class GuardChiefDto {
  id: string;
  name: string;
  lastname: string;
  email: string;
}

export class DelegationDto {
  id: string;
  name: string;
}

export class GuardiaDto {
  id: string;
  date: string;
  state: 'En curso' | 'Nueva' | 'Cerrada';
  guardChief: GuardChiefDto;
  delegation: DelegationDto;
}

export class GuardiasResponseDto {
  success: boolean;
  data: GuardiaDto[];
  error?: string;
}