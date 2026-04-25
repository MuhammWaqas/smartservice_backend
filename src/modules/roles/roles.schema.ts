import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Role {

  @Prop({ unique: true })
  name: string;

}

export const RoleSchema =
  SchemaFactory.createForClass(Role);
