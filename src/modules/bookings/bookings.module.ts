// src/modules/bookings/bookings.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { Service, ServiceSchema } from '../services/schemas/service.schema';


@Module({
  imports: [MongooseModule.forFeature([
  { name: Booking.name, schema: BookingSchema },
  { name: Service.name, schema: ServiceSchema },
  ])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule { }
