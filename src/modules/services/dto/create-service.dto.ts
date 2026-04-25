import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateServiceDto {

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  category: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  provider: string;

  @IsArray()
  @IsOptional()
  @Type(() => String)
  AI_tags?: string[];

  @IsArray()
  @IsOptional()
  @Type(() => String)
  images?: string[];

  @IsString()
  @IsOptional()
  status: 'pending' | 'active' | 'inactive' = 'active';

  @IsString()
  slug: string;
}
