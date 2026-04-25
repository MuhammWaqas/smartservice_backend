import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/users.schema';
import { RolesService } from '../roles/roles.service';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private rolesService: RolesService,
  ) { }

  async findAll() {
    return this.userModel.find().populate('role', 'name').exec();
  }

  // Add this method
  async findById(id: string) {
    const user = await this.userModel
      .findById(id)
      .populate('role', 'name')
      .exec();

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async activateProvider(id: string, providerStatus: boolean) {
    const user = await this.findById(id);

    user.isProviderActive = providerStatus;

    if (providerStatus) {
      // get provider role from Roles collection
      const providerRole = await this.rolesService.findRole("provider");
      if (!providerRole) throw new NotFoundException('Provider role not found');
      user.role = providerRole._id as any; // <-- change role to provider
    }

    await user.save();
    return user;
  }



  async blockUser(id: string, blockStatus: boolean) {
    const user = await this.findById(id);
    user.isBlocked = blockStatus;  // <-- now uses the value you pass
    await user.save();
    return user;
  }

}
