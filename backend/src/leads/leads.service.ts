import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { LeadDocument } from './schemas/lead.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel('Lead') private leadModel: Model<LeadDocument>,
    @InjectModel('Customer') private customerModel: Model<any>,
    @InjectModel('Vehicle') private vehicleModel: Model<any>,
    private readonly notifications: NotificationsService,
  ) {}

  async create(createLeadDto: any): Promise<LeadDocument> {
    const leadId = createLeadDto.leadId || `LEAD-${Date.now()}`;
    const createdLead = new this.leadModel({ ...createLeadDto, leadId });
    const saved = await createdLead.save();
    await this.notifications.create({ title: 'New lead received', message: `A new lead ${leadId} was created.`, channel: 'in-app', entityType: 'Lead', entityId: String(saved._id) }).catch(() => undefined);
    return saved;
  }

  async createPublicInquiry(input: any): Promise<LeadDocument> {
    const fullName = String(input.fullName || '').trim();
    const phone = String(input.phone || '').trim();
    if (fullName.length < 2 || phone.replace(/\D/g, '').length < 7) {
      throw new BadRequestException('Name and a valid phone number are required.');
    }
    let vehicleId: string | undefined = undefined;
    if (input.vehicle) {
      const vId = String(input.vehicle);
      if (!isValidObjectId(vId)) {
        throw new BadRequestException('The selected vehicle ID is invalid.');
      }
      const vehicle = await this.vehicleModel.findById(vId).exec();
      if (!vehicle) {
        throw new BadRequestException('The selected vehicle does not exist.');
      }
      vehicleId = String(vehicle._id);
    }
    let customer = await this.customerModel.findOne({ phone }).exec();
    if (!customer) {
      customer = await new this.customerModel({
        fullName,
        phone,
        email: input.email,
        customerType: 'Individual',
      }).save();
    }
    return this.create({
      customer: customer._id,
      interestedVehicle: vehicleId,
      source: 'Website',
      status: 'New',
      priority: 'Medium',
      inquiryType: String(input.inquiryType || 'General').slice(0, 40),
      inquiryMessage: String(input.message || '').slice(0, 1000),
      preferredDate: input.preferredDate || undefined,
    });
  }

  async findAll(): Promise<LeadDocument[]> {
    return this.leadModel.find().populate('customer').populate('interestedVehicle', 'stockNumber make model year sellingPrice status').sort({ createdAt: -1 }).exec();
  }

  async findByCustomer(customerId: string): Promise<LeadDocument[]> {
    return this.leadModel.find({ customer: customerId }).populate('interestedVehicle', 'stockNumber make model year sellingPrice status imageUrls').sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<LeadDocument> {
    const lead = await this.leadModel.findById(id).populate('customer').exec();
    if (!lead) {
      throw new NotFoundException(`Lead #${id} not found`);
    }
    return lead;
  }

  async update(id: string, updateLeadDto: any): Promise<LeadDocument> {
    const existingLead = await this.leadModel.findByIdAndUpdate(
      id,
      updateLeadDto,
      { new: true }
    ).exec();
    if (!existingLead) {
      throw new NotFoundException(`Lead #${id} not found`);
    }
    return existingLead;
  }

  async remove(id: string): Promise<any> {
    const deletedLead = await this.leadModel.findByIdAndDelete(id).exec();
    if (!deletedLead) {
      throw new NotFoundException(`Lead #${id} not found`);
    }
    return deletedLead;
  }
}
