import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ExpenseCategoriesService {
  constructor(@InjectModel('ExpenseCategory') private readonly model: Model<any>) {}
  async create(input: any) { return this.model.findOneAndUpdate({ name: input.name }, { $set: input }, { upsert: true, new: true, runValidators: true }).exec(); }
  findAll() { return this.model.find().sort({ name: 1 }).exec(); }
  async remove(id: string) {
    const item = await this.model.findByIdAndDelete(id).exec();
    if (!item) throw new NotFoundException(`Expense category ${id} not found.`);
    return item;
  }
}
