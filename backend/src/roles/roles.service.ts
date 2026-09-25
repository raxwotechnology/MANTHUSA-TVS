import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RolesService {
  constructor(@InjectModel('Role') private roleModel: Model<any>) {}

  async findAll() {
    return this.roleModel.find().exec();
  }

  async create(createRoleDto: any) {
    const createdRole = new this.roleModel(createRoleDto);
    return createdRole.save();
  }
}
