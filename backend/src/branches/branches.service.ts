import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BranchesService {
  constructor(@InjectModel('Branch') private readonly model: Model<any>) {}
  create(input: any) { return new this.model(input).save(); }
  findAll() { return this.model.find().sort({ name: 1 }).exec(); }
  async update(id: string, input: any) {
    const branch = await this.model.findByIdAndUpdate(id, input, { new: true, runValidators: true }).exec();
    if (!branch) throw new NotFoundException(`Branch ${id} not found.`);
    return branch;
  }
  async remove(id: string) {
    const branch = await this.model.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
    if (!branch) throw new NotFoundException(`Branch ${id} not found.`);
    return branch;
  }
}
