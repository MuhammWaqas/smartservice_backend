import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class User {

  @Prop()
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  })
  role: mongoose.Schema.Types.ObjectId;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({ default: false })
  isProviderActive: boolean;

}

export const UserSchema =
  SchemaFactory.createForClass(User);
