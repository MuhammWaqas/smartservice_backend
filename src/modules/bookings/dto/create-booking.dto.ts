// src/modules/bookings/dto/create-booking.dto.ts
import { IsNotEmpty, IsDateString, IsNumber, IsOptional, IsString, IsObject } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  service_id: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsString()
  time: string;

  @IsNotEmpty()
  @IsNumber()
  total_amount: number;

  // These come from your frontend's formData directly
  @IsNotEmpty()
  @IsString()
  address: string; // The "street" or "formatted_address" string

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  zip?: string;

  @IsOptional()
  @IsObject()
  location?: {
    lat: number;
    lng: number;
  };
}