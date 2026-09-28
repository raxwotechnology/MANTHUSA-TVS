import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PermissionsService {
  constructor(@InjectModel('Permission') private readonly model: Model<any>) {}
  async set(input: any) {
    const { role, module, ...flags } = input;
    const allowed = ['canView', 'canCreate', 'canEdit', 'canDelete', 'canApprove', 'canExport'];
    const permission = Object.fromEntries(allowed.map((key) => [key, flags[key] === true]));
    return this.model.findOneAndUpdate({ role, module }, { $set: permission }, { new: true, upsert: true, runValidators: true }).populate('role').exec();
  }
  findAll() { return this.model.find().populate('role').sort({ module: 1 }).exec(); }
  async remove(id: string) {
    const item = await this.model.findByIdAndDelete(id).exec();
    if (!item) throw new NotFoundException(`Permission ${id} not found.`);
    return item;
  }
}
