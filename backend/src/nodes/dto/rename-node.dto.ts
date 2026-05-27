import { IsString } from 'class-validator';

export class RenameNodeDto {
  @IsString()
  name: string;
}
