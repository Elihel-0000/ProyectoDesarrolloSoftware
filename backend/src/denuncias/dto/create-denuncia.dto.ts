import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDenunciaDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  }, { toClassOnly: true })
  @IsNumber({}, { message: 'latitud debe ser un número' })
  latitud?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  }, { toClassOnly: true })
  @IsNumber({}, { message: 'longitud debe ser un número' })
  longitud?: number;

  @IsOptional()
  @IsString()
  direccion?: string;
}
