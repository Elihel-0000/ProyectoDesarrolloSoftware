import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  correo: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  contrasena: string;

  @IsString()
  @IsOptional()
  @IsIn(['citizen', 'authority'])
  rol?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
