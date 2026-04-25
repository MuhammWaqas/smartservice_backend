import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PassportModule } from '@nestjs/passport';
import { ServicesModule } from './modules/services/services.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { BookingsModule } from './modules/bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UsersModule,
    RolesModule,
    ServicesModule,
    ProvidersModule,
    BookingsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
