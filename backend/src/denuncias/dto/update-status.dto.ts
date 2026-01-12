import { IsIn, IsString } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  @IsIn(['pending', 'in_progress', 'resolved'])
  estado: string;
}
