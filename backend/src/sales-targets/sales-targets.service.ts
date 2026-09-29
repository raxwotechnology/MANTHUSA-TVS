import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SalesTargetsService {
  constructor(@InjectModel('SalesTarget') private readonly model: Model<any>, @InjectModel('Sale') private readonly sales: Model<any>) {}
  async create(input: any) {
    if (!input.salesperson || !/^\d{4}-\d{2}$/.test(input.month || '') || Number(input.vehicleTarget) < 0 || Number(input.revenueTarget) < 0) {
      throw new BadRequestException('Salesperson, month (YYYY-MM), and non-negative targets are required.');
    }
    const row = await this.model.findOneAndUpdate(
      { salesperson: input.salesperson, month: input.month },
      { $set: input }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    ).exec();
    return row;
  }
  async findAll() {
    const rows = await this.model.find().populate('salesperson', 'name email').sort({ month: -1 }).exec();
    return Promise.all(rows.map(async (row) => {
      const [year, month] = row.month.split('-').map(Number);
      const from = new Date(Date.UTC(year, month - 1, 1));
      const to = new Date(Date.UTC(year, month, 1));
      const sales = await this.sales.find({ salesperson: row.salesperson?._id || row.salesperson, saleDate: { $gte: from, $lt: to }, status: { $nin: ['Cancelled', 'Refunded'] } }).select('finalAmount').exec();
      row.actualVehicles = sales.length;
      row.actualRevenue = sales.reduce((sum, sale) => sum + Number(sale.finalAmount || 0), 0);
      row.achievementPercentage = Number(row.revenueTarget) > 0 ? row.actualRevenue / Number(row.revenueTarget) * 100 : 0;
      return row;
    }));
  }
  async update(id: string, input: any) {
    const row = await this.model.findByIdAndUpdate(id, input, { new: true, runValidators: true }).exec();
    if (!row) throw new NotFoundException(`Sales target ${id} not found.`);
    return row;
  }
  async remove(id: string) {
    const row = await this.model.findByIdAndDelete(id).exec();
    if (!row) throw new NotFoundException(`Sales target ${id} not found.`);
    return row;
  }
}
