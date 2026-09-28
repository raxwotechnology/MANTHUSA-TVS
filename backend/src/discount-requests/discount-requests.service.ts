import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DiscountRequestsService {
  constructor(
    @InjectModel('DiscountRequest') private readonly requests: Model<any>,
    @InjectModel('Quotation') private readonly quotations: Model<any>,
    @InjectModel('Vehicle') private readonly vehicles: Model<any>,
  ) {}
  async create(input: any, userId: string) {
    const requestedDiscount = Number(input.requestedDiscount);
    if (!userId || !input.quotation || !Number.isFinite(requestedDiscount) || requestedDiscount <= 0) throw new BadRequestException('Quotation and a positive requested discount are required.');
    const quotation = await this.quotations.findById(input.quotation).exec();
    if (!quotation) throw new NotFoundException('Quotation not found.');
    if (requestedDiscount >= Number(quotation.vehiclePrice || 0)) throw new BadRequestException('Requested discount must be less than the vehicle price.');
    return new this.requests({ ...input, requestedBy: userId, requestedDiscount, status: 'Pending' }).save();
  }
  findAll() { return this.requests.find().populate('quotation').populate('requestedBy', 'name').populate('approvedBy', 'name').sort({ createdAt: -1 }).exec(); }
  async decide(id: string, input: any, approverId: string, role: string) {
    if (!['Admin', 'Admin / Owner'].includes(role)) throw new ForbiddenException('Only an admin can approve a discount.');
    const request = await this.requests.findById(id).exec();
    if (!request) throw new NotFoundException('Discount request not found.');
    if (request.status !== 'Pending') throw new BadRequestException('This discount request has already been reviewed.');
    if (!['Approved', 'Rejected'].includes(input.status)) throw new BadRequestException('Decision must be Approved or Rejected.');
    if (input.status === 'Approved') {
      const quotation = await this.quotations.findById(request.quotation).exec();
      if (!quotation) throw new NotFoundException('Quotation not found.');
      const vehicle = await this.vehicles.findById(quotation.vehicle).exec();
      if (vehicle?.minimumSellingPrice && quotation.vehiclePrice - request.requestedDiscount < vehicle.minimumSellingPrice) throw new BadRequestException('Approved discount would put the vehicle below its minimum selling price.');
      quotation.discount = request.requestedDiscount;
      quotation.totalAmount = quotation.vehiclePrice - quotation.discount + quotation.registrationFee + quotation.insuranceFee + quotation.otherCharges;
      await quotation.save();
    }
    request.status = input.status; request.approvedBy = approverId; request.approvalDate = new Date();
    return request.save();
  }
}
