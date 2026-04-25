import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @IsOptional()
  @IsString()
  status?: 'pending' | 'active' | 'inactive';

  @IsOptional()
  @IsString()
  slug?: string;
}
