import { Controller, Get, Patch, Param, UseGuards, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesEnum } from '../../common/enums/roles.enum';

@Controller('users')  // Ye route name define karta hai
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.SUPER_ADMIN)
  @Patch('block/:id')
  async toggleBlockUser(
    @Param('id') id: string,
    @Body('isBlocked') isBlocked: boolean
  ) {
    const user = await this.usersService.blockUser(id, isBlocked);
    return {
      message: isBlocked ? 'User blocked successfully' : 'User unblocked successfully',
      user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.SUPER_ADMIN)
  @Patch('activate-provider/:id')
  async activateProvider(
    @Param('id') id: string,
    @Body('isProviderActive') isProviderActive: boolean, // <-- match property name
  ) {
    const user = await this.usersService.activateProvider(id, isProviderActive);
    return {
      message: isProviderActive ? 'Provider activated' : 'Provider deactivated',
      user,
    };
  }



}
