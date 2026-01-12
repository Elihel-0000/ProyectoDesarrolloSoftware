import { IsNotEmpty, IsString } from 'class-validator';

export class CreateComentarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El contenido del comentario es requerido' })
  contenido: string;
}
