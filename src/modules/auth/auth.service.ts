import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from "bcrypt";

import { JwtService } from '@nestjs/jwt';

import { User } from '../users/schemas/users.schema';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';

import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private usersService: UsersService,
    private rolesService: RolesService,
  ) { }

  async signup(dto: SignupDto) {

    const hash = await bcrypt.hash(dto.password, 10);

    const role = await this.rolesService.findRole("user");

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.userModel.create({
      ...dto,
      password: hash,
      role: role._id,
    });

    return { message: "User Registered" };
  }

  async login(dto: LoginDto) {

    const user = await this.userModel
      .findOne({ email: dto.email })
      .populate('role', 'name');

    if (!user)
      throw new UnauthorizedException();

    if (user.isBlocked)
      throw new UnauthorizedException("Blocked by admin");

    const match = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!match)
      throw new UnauthorizedException();

    const role = user.role as any;

    const payload = {
      sub: user._id,
      role: role.name,
      isProviderActive: user.isProviderActive, // include this
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: role.name,
        isProviderActive: user.isProviderActive,
      },
    }
  };
}
