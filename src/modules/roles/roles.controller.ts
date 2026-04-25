import { Body, Controller, Get, Post } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";

@Controller("/api/roles")
export class RolesController {

  constructor(private rolesService: RolesService) {}

  @Post()
  createRole(@Body() dto: CreateRoleDto) {
    return this.rolesService.createRole(dto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

}
