import { IsEnum, IsOptional, IsString, IsInt } from 'class-validator';
import { NodeType } from '@prisma/client';

export class CreateNodeDto {
  @IsString()
  name: string;

  @IsEnum(NodeType)
  type: NodeType;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsInt()
  size?: number;

  @IsOptional()
  @IsString()
  mimeType?: string;
}
