import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Role } from "./roles.schema";
import { CreateRoleDto } from "./dto/create-role.dto";

@Injectable()
export class RolesService {

  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
  ) {}

  async createRole(dto: CreateRoleDto) {
    return this.roleModel.create(dto);
  }

  async findAll() {
    return this.roleModel.find();
  }

  async findRole(name: string) {
    return this.roleModel.findOne({ name });
  }

}
