// src/modules/bookings/schemas/booking.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Service', required: true })
  service_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  provider_id: Types.ObjectId;

  @Prop({ required: true })
  slug: string;

  @Prop({
    default: 'pending',
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
  })
  status: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ required: true })
  time: string;

  @Prop({
    type: {
      street: String,
      city: String,
      state: String,
      zip: String,
      lat: Number,
      lng: Number,
    },
    default: {},
  })
  address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    lat?: number;
    lng?: number;
  };

  @Prop({ required: true })
  total_amount: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
