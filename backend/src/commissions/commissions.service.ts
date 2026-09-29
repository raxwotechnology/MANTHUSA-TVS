import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CommissionsService {
  constructor(
    @InjectModel('Commission') private readonly model: Model<any>,
    @InjectModel('Sale') private readonly sales: Model<any>,
  ) {}
  async create(input: any) {
    if (!input.salesperson || !input.sale || !input.commissionType) throw new BadRequestException('Salesperson, sale and commission type are required.');
    const sale = await this.sales.findById(input.sale).exec();
    if (!sale) throw new NotFoundException('Sale not found.');
    const percentage = Number(input.commissionPercentage || 0);
    const amount = input.commissionType === 'Percentage' ? Number(sale.finalAmount || 0) * percentage / 100 : Number(input.commissionAmount || 0);
    if (amount < 0 || (input.commissionType === 'Percentage' && (percentage <= 0 || percentage > 100))) throw new BadRequestException('Commission amount or percentage is invalid.');
    return new this.model({ ...input, commissionAmount: amount }).save();
  }
  findAll() { return this.model.find().populate('salesperson', 'name email').populate('sale').sort({ createdAt: -1 }).exec(); }
  async update(id: string, input: any) {
    const item = await this.model.findByIdAndUpdate(id, input, { new: true, runValidators: true }).exec();
    if (!item) throw new NotFoundException(`Commission ${id} not found.`);
    return item;
  }
  async remove(id: string) {
    const item = await this.model.findByIdAndDelete(id).exec();
    if (!item) throw new NotFoundException(`Commission ${id} not found.`);
    return item;
  }
}
