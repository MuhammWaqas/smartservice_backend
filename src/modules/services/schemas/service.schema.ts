import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  provider: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  AI_tags: string[];

  @Prop({ default: [] })
  images: string[];

  @Prop({ default: 'pending' })
  status: 'pending' | 'active' | 'inactive';

  @Prop({ required: true, unique: true })
  slug: string;

}

export const ServiceSchema = SchemaFactory.createForClass(Service);
