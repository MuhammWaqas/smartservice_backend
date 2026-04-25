import { ConfigService } from '@nestjs/config';

export const getJwtConfig = (configService: ConfigService) => ({
  secret: configService.get<string>('MY_JWT_SECRET'),
  expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1d',
});
