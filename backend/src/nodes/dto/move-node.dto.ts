import { IsOptional, IsString } from 'class-validator';

export class MoveNodeDto {
  @IsOptional()
  @IsString()
  parentId: string | null;
}
