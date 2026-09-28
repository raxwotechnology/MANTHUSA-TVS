import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class VehicleHandoversService {
  constructor(
    @InjectModel('VehicleHandover') private readonly handovers: Model<any>,
    @InjectModel('Sale') private readonly sales: Model<any>,
  ) {}
  async create(input: any) {
    if (!input.sale || !input.vehicle || !input.customer) throw new BadRequestException('Sale, vehicle and customer are required.');
    const sale = await this.sales.findById(input.sale).exec();
    if (!sale) throw new NotFoundException('Sale not found.');
    if (!['Confirmed', 'Completed'].includes(sale.status)) throw new BadRequestException('Only confirmed sales can be handed over.');
    return new this.handovers(input).save();
  }
  findAll() { return this.handovers.find().populate('sale').populate('vehicle').populate('customer').sort({ createdAt: -1 }).exec(); }
  async update(id: string, input: any) {
    const handover = await this.handovers.findById(id).exec();
    if (!handover) throw new NotFoundException(`Handover ${id} not found.`);
    Object.assign(handover, input);
    if (input.status === 'Completed') {
      const required = ['vehicleInspection', 'keys', 'spareKey', 'cr', 'insurance', 'serviceBook', 'userManual', 'accessories', 'numberPlates', 'customerSignature'];
      if (!required.every((key) => handover.checklist?.[key] === true)) throw new BadRequestException('Complete all handover checklist items before closing the handover.');
      const sale = await this.sales.findById(handover.sale).exec();
      if (sale) { sale.status = 'Completed'; await sale.save(); }
    }
    return handover.save();
  }
}
