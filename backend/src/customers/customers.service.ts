import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomerDocument } from './schemas/customer.schema';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel('Customer') private customerModel: Model<CustomerDocument>,
    @InjectModel('Lead') private leads: Model<any>, @InjectModel('FollowUp') private followUps: Model<any>,
    @InjectModel('TestDrive') private testDrives: Model<any>, @InjectModel('Quotation') private quotations: Model<any>,
    @InjectModel('Reservation') private reservations: Model<any>, @InjectModel('Payment') private payments: Model<any>,
    @InjectModel('Sale') private sales: Model<any>, @InjectModel('VehicleHandover') private handovers: Model<any>,
    @InjectModel('Complaint') private complaints: Model<any>, @InjectModel('AfterSales') private afterSales: Model<any>,
  ) {}

  async create(createCustomerDto: any): Promise<CustomerDocument> {
    const createdCustomer = new this.customerModel(createCustomerDto);
    return createdCustomer.save();
  }

  async findAll(source?: string): Promise<CustomerDocument[]> {
    const filter = source ? { customerSource: new RegExp(`^${source}$`, 'i') } : {};
    return this.customerModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<CustomerDocument> {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return customer;
  }

  async timeline(id: string) {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) throw new NotFoundException(`Customer #${id} not found`);
    const queries = [
      ['Lead', this.leads.find({ customer: id }).populate('interestedVehicle')],
      ['Follow-up', this.followUps.find({ customer: id }).populate('vehicle')],
      ['Test drive', this.testDrives.find({ customer: id }).populate('vehicle')],
      ['Quotation', this.quotations.find({ customer: id }).populate('vehicle')],
      ['Reservation', this.reservations.find({ customer: id }).populate('vehicle')],
      ['Payment', this.payments.find({ customer: id }).populate('sale')],
      ['Sale', this.sales.find({ customer: id }).populate('vehicle')],
      ['Handover', this.handovers.find({ customer: id }).populate('vehicle')],
      ['Complaint', this.complaints.find({ customer: id })],
      ['After-sales', this.afterSales.find({ customer: id })],
    ] as const;
    const records = await Promise.all(queries.map(async ([type, query]) => (await query.sort({ createdAt: -1 }).limit(100).exec()).map((record) => ({ type, record }))));
    return records.flat().map(({ type, record }) => {
      const related = record.vehicle || record.interestedVehicle;
      const vehicle = related ? `${related.make || ''} ${related.model || ''}`.trim() : '';
      const date = record.followUpDate || record.date || record.saleDate || record.paymentDate || record.handoverDate || record.nextFollowUp || record.createdAt;
      const detail = record.status || record.feedback || record.notes || record.description || record.customerFeedback || record.invoiceNumber || '';
      return { type, date, detail: `${vehicle ? `${vehicle} · ` : ''}${detail}`, id: record._id };
    }).sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  }

  async update(id: string, updateCustomerDto: any): Promise<CustomerDocument> {
    const existingCustomer = await this.customerModel.findByIdAndUpdate(
      id,
      updateCustomerDto,
      { new: true }
    ).exec();
    if (!existingCustomer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return existingCustomer;
  }

  async findByUserId(userId: string): Promise<CustomerDocument | null> {
    return this.customerModel.findOne({ userId }).exec();
  }

  async updateByUserId(userId: string, updateCustomerDto: any): Promise<CustomerDocument> {
    const updated = await this.customerModel.findOneAndUpdate(
      { userId },
      { $set: updateCustomerDto },
      { new: true }
    ).exec();
    if (!updated) {
      throw new NotFoundException(`Customer profile for user ${userId} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<any> {
    const deletedCustomer = await this.customerModel.findByIdAndDelete(id).exec();
    if (!deletedCustomer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return deletedCustomer;
  }
}
