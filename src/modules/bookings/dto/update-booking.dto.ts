// src/modules/bookings/dto/update-booking.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class UpdateBookingDto {
  @IsOptional()
  @IsString()
  status?: 'pending' | 'approved' | 'rejected';
}
