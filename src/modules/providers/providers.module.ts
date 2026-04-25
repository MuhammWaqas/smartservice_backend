import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';

import { User, UserSchema } from '../users/schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [ProvidersController],
  providers: [ProvidersService],
})
export class ProvidersModule {}
