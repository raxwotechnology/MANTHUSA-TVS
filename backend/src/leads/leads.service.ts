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
    @InjectModel('Reservation') private reservationModel: Model<any>,
    private readonly notifications: NotificationsService,
  ) {}

  async create(createLeadDto: any): Promise<LeadDocument> {
    const leadId = createLeadDto.leadId || `TVS-REQ-${Date.now().toString().slice(-6)}`;
    const createdLead = new this.leadModel({
      ...createLeadDto,
      leadId,
      status: createLeadDto.status || 'New Request',
    });
    const saved = await createdLead.save();
    await this.notifications.create({
      title: 'New TVS Motorcycle Request',
      message: `A new customer request ${leadId} was received for ${saved.modelName || 'a motorcycle'}.`,
      channel: 'in-app',
      entityType: 'Lead',
      entityId: String(saved._id),
    }).catch(() => undefined);
    return saved;
  }

  async createPublicInquiry(input: any): Promise<LeadDocument> {
    const fullName = String(input.fullName || input.name || '').trim();
    const phone = String(input.phone || '').trim();
    if (fullName.length < 2 || phone.replace(/\D/g, '').length < 7) {
      throw new BadRequestException('Name and a valid phone number are required.');
    }

    let vehicleId: string | undefined = undefined;
    let modelName = String(input.modelName || input.model || '').trim();
    let variantName = String(input.variantName || input.variant || '').trim();
    let selectedColor = String(input.selectedColor || input.color || '').trim();

    if (input.vehicle || input.vehicleId) {
      const vId = String(input.vehicle || input.vehicleId);
      if (isValidObjectId(vId)) {
        const vehicle = await this.vehicleModel.findById(vId).exec();
        if (vehicle) {
          vehicleId = String(vehicle._id);
          if (!modelName) modelName = vehicle.model;
          if (!variantName && vehicle.variant) variantName = vehicle.variant;
          if (!selectedColor && vehicle.color) selectedColor = vehicle.color;
        }
      }
    }

    let customer = await this.customerModel.findOne({ phone }).exec();
    if (!customer && input.email) {
      customer = await this.customerModel.findOne({ email: input.email.trim().toLowerCase() }).exec();
    }

    if (!customer) {
      customer = await new this.customerModel({
        fullName,
        phone,
        email: input.email ? input.email.trim().toLowerCase() : undefined,
        city: input.city || input.preferredBranchName || undefined,
        customerType: 'Individual',
      }).save();
    }

    return this.create({
      customer: customer._id,
      interestedVehicle: vehicleId,
      interestedVehicleText: input.interestedVehicleText || `${modelName} ${variantName} (${selectedColor})`.trim(),
      modelName,
      variantName,
      selectedColor,
      preferredBranch: input.preferredBranch && isValidObjectId(input.preferredBranch) ? input.preferredBranch : undefined,
      preferredBranchName: input.preferredBranchName || input.branch || '',
      source: input.source || 'Website Configurator',
      status: 'New Request',
      priority: input.priority || 'Medium',
      inquiryType: String(input.inquiryType || 'Motorcycle Booking Request').slice(0, 50),
      inquiryMessage: String(input.message || input.inquiryMessage || '').slice(0, 1000),
      budget: Number(input.budget || input.price || 0),
      preferredDate: input.preferredDate ? new Date(input.preferredDate) : undefined,
    });
  }

  async convertToBooking(id: string, staffUser?: any): Promise<any> {
    const lead = await this.leadModel.findById(id).populate('customer').populate('interestedVehicle').exec();
    if (!lead) throw new NotFoundException(`Request #${id} not found.`);

    if (lead.bookingId) {
      const existing = await this.reservationModel.findById(lead.bookingId).exec();
      if (existing) return { lead, booking: existing, message: 'Already converted to booking.' };
    }

    const bookingNumber = `TVS-BK-${Date.now().toString().slice(-6)}`;
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days reservation
    const vehicle = lead.interestedVehicle as any;
    const customer = lead.customer as any;

    const booking = new this.reservationModel({
      bookingNumber,
      reservationId: bookingNumber,
      customer: customer?._id || customer,
      vehicle: vehicle?._id || vehicle,
      modelName: lead.modelName || vehicle?.model,
      variantName: lead.variantName || vehicle?.variant,
      selectedColor: lead.selectedColor || vehicle?.color,
      branch: lead.preferredBranch || (vehicle?.branch || vehicle?.location),
      branchName: lead.preferredBranchName,
      salesperson: staffUser?._id || staffUser?.sub,
      reservationDeposit: 5000, // Standard TVS booking deposit
      expiryDate,
      status: 'Active',
      leadId: lead._id,
      notes: `Converted from Customer Request ${lead.leadId}.`,
    });

    const savedBooking = await booking.save();
    lead.status = 'Converted to Booking';
    lead.bookingId = savedBooking._id;
    await lead.save();

    await this.notifications.create({
      title: 'Booking Created',
      message: `Request ${lead.leadId} converted to Booking ${bookingNumber}.`,
      channel: 'in-app',
      entityType: 'Reservation',
      entityId: String(savedBooking._id),
    }).catch(() => undefined);

    return { lead, booking: savedBooking };
  }

  async findAll(): Promise<LeadDocument[]> {
    return this.leadModel
      .find()
      .populate('customer')
      .populate('interestedVehicle', 'stockNumber make model year sellingPrice status images')
      .populate('preferredBranch')
      .populate('bookingId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByCustomer(customerId: string): Promise<LeadDocument[]> {
    return this.leadModel
      .find({ customer: customerId })
      .populate('interestedVehicle', 'stockNumber make model year sellingPrice status images')
      .populate('preferredBranch')
      .populate('bookingId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<LeadDocument> {
    const lead = await this.leadModel
      .findById(id)
      .populate('customer')
      .populate('interestedVehicle')
      .populate('preferredBranch')
      .populate('bookingId')
      .exec();
    if (!lead) {
      throw new NotFoundException(`Request #${id} not found`);
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
      throw new NotFoundException(`Request #${id} not found`);
    }
    return existingLead;
  }

  async remove(id: string): Promise<any> {
    const deletedLead = await this.leadModel.findByIdAndDelete(id).exec();
    if (!deletedLead) {
      throw new NotFoundException(`Request #${id} not found`);
    }
    return deletedLead;
  }
}
