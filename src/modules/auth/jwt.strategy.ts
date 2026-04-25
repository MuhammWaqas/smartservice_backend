import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private usersService: UsersService,
        private configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('MY_JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        const user = await this.usersService.findById(payload.sub);
        if (!user) return null;

        return {
            _id: user._id,
            email: user.email,
            role: payload.role, // use role from JWT payload
            isBlocked: user.isBlocked,
            isProviderActive: payload.isProviderActive, // now this will be correct
        };

    }




}
