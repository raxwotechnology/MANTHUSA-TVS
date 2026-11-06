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
    @InjectModel('Sale') private saleModel: Model<any>,
    private readonly notifications: NotificationsService,
  ) {}

  async create(createLeadDto: any): Promise<LeadDocument> {
    const leadId = createLeadDto.leadId || `TVS-REQ-${Date.now().toString().slice(-6)}`;
    let category = createLeadDto.category;
    let vehicleType = createLeadDto.vehicleType;
    let engineCapacity = createLeadDto.engineCapacity;

    if (createLeadDto.interestedVehicle && (!category || !vehicleType || !engineCapacity)) {
      if (isValidObjectId(createLeadDto.interestedVehicle)) {
        const v = await this.vehicleModel.findById(createLeadDto.interestedVehicle).exec();
        if (v) {
          if (!category) category = v.category;
          if (!vehicleType) vehicleType = v.vehicleType;
          if (!engineCapacity) engineCapacity = v.engineCapacity;
        }
      }
    }

    const createdLead = new this.leadModel({
      ...createLeadDto,
      leadId,
      category: category || 'Sport Motorcycles',
      vehicleType: vehicleType || 'Motorcycle',
      engineCapacity: engineCapacity || '',
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
    let category = String(input.category || '').trim();
    let vehicleType = String(input.vehicleType || '').trim();
    let engineCapacity = String(input.engineCapacity || '').trim();

    if (input.vehicle || input.vehicleId) {
      const vId = String(input.vehicle || input.vehicleId);
      if (isValidObjectId(vId)) {
        const vehicle = await this.vehicleModel.findById(vId).exec();
        if (vehicle) {
          vehicleId = String(vehicle._id);
          if (!modelName) modelName = vehicle.model;
          if (!variantName && vehicle.variant) variantName = vehicle.variant;
          if (!selectedColor && vehicle.color) selectedColor = vehicle.color;
          if (!category && vehicle.category) category = vehicle.category;
          if (!vehicleType && vehicle.vehicleType) vehicleType = vehicle.vehicleType;
          if (!engineCapacity && vehicle.engineCapacity) engineCapacity = vehicle.engineCapacity;
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
        customerSource: 'Online',
      }).save();
    }

    return this.create({
      customer: customer._id,
      interestedVehicle: vehicleId,
      interestedVehicleText: input.interestedVehicleText || `${modelName} ${variantName} (${selectedColor})`.trim(),
      modelName,
      variantName,
      selectedColor,
      category: category || 'Sport Motorcycles',
      vehicleType: vehicleType || 'Motorcycle',
      engineCapacity: engineCapacity || '',
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

  async convertToInvoice(id: string, invoiceData?: any, staffUser?: any): Promise<any> {
    const lead = await this.leadModel
      .findById(id)
      .populate('customer')
      .populate('interestedVehicle')
      .exec();
    if (!lead) throw new NotFoundException(`Request #${id} not found.`);

    if (lead.invoiceId) {
      const existing = await this.saleModel.findById(lead.invoiceId).exec();
      if (existing) return { lead, sale: existing, message: 'Already converted to invoice.' };
    }

    const customer = lead.customer as any;
    if (!customer) throw new BadRequestException('Request does not have a linked customer record.');

    let vehicle = lead.interestedVehicle as any;
    if (invoiceData?.vehicle && isValidObjectId(invoiceData.vehicle)) {
      const selectedV = await this.vehicleModel.findById(invoiceData.vehicle).exec();
      if (selectedV) vehicle = selectedV;
    }

    // If still no vehicle, try to find an available matching motorcycle in stock
    if (!vehicle) {
      const matched = await this.vehicleModel
        .findOne({
          status: { $in: ['Available', 'In Stock'] },
          ...(lead.modelName ? { model: new RegExp(lead.modelName, 'i') } : {}),
        })
        .exec();
      if (matched) vehicle = matched;
    }

    // If still no vehicle in stock, find any available vehicle or create a mock/fallback vehicle
    if (!vehicle) {
      vehicle = await this.vehicleModel.findOne({ status: { $in: ['Available', 'In Stock'] } }).exec();
    }

    if (!vehicle) {
      throw new BadRequestException('No available motorcycle found in inventory to assign to this invoice. Please add or make available a motorcycle first.');
    }

    const invoiceNumber = invoiceData?.invoiceNumber || `TVS-INV-${Date.now().toString().slice(-6)}`;
    const contractNumber = invoiceData?.salesContractNumber || `TVS-CNT-${Date.now().toString().slice(-6)}`;

    const vehiclePrice = Number(invoiceData?.vehiclePrice ?? vehicle.sellingPrice ?? lead.budget ?? 850000);
    const discount = Number(invoiceData?.discount || 0);
    const registrationFee = Number(invoiceData?.registrationFee || 0);
    const insuranceFee = Number(invoiceData?.insuranceFee || 0);
    const additionalCharges = Number(invoiceData?.additionalCharges || 0);
    const finalAmount = Math.max(0, vehiclePrice - discount + registrationFee + insuranceFee + additionalCharges);
    const paidAmount = Number(invoiceData?.paidAmount ?? finalAmount);
    const balance = Math.max(0, finalAmount - paidAmount);

    const sale = new this.saleModel({
      invoiceNumber,
      salesContractNumber: contractNumber,
      customer: customer._id || customer,
      vehicle: vehicle._id || vehicle,
      salesperson: staffUser?._id || staffUser?.sub,
      branch: lead.preferredBranch || vehicle.branch || vehicle.location,
      branchName: lead.preferredBranchName || vehicle.branch || 'Colombo Flagship Hub',
      modelName: lead.modelName || vehicle.model,
      variantName: lead.variantName || vehicle.variant,
      selectedColor: lead.selectedColor || vehicle.color,
      chassisNumber: vehicle.chassisNumber || '',
      engineNumber: vehicle.engineNumber || '',
      vehiclePrice,
      discount,
      registrationFee,
      insuranceFee,
      additionalCharges,
      finalAmount,
      paidAmount,
      balance,
      paymentMethod: invoiceData?.paymentMethod || 'Cash',
      status: paidAmount >= finalAmount ? 'Paid in Full' : paidAmount > 0 ? 'Partially Paid' : 'Pending',
      saleDate: new Date(),
    });

    const savedSale = await sale.save();

    // Mark vehicle as Sold
    await this.vehicleModel.findByIdAndUpdate(vehicle._id, { status: 'Sold' }).exec();

    // Update lead status to Purchased and link invoice
    lead.status = 'Purchased';
    lead.invoiceId = savedSale._id;
    await lead.save();

    await this.notifications.create({
      title: 'Request Converted to Invoice',
      message: `Customer Request ${lead.leadId} converted to Invoice ${invoiceNumber}. Status marked as Purchased.`,
      channel: 'in-app',
      entityType: 'Sale',
      entityId: String(savedSale._id),
    }).catch(() => undefined);

    return { lead, sale: savedSale };
  }

  async markLostSale(id: string, lostReason?: string): Promise<LeadDocument> {
    const lead = await this.leadModel.findById(id).exec();
    if (!lead) throw new NotFoundException(`Request #${id} not found.`);
    lead.status = 'Lost Sale';
    if (lostReason) lead.lostReason = lostReason;
    await lead.save();
    return lead;
  }

  async updateStatus(id: string, status: string, lostReason?: string): Promise<LeadDocument> {
    const lead = await this.leadModel.findById(id).exec();
    if (!lead) throw new NotFoundException(`Request #${id} not found.`);
    lead.status = status;
    if (lostReason) lead.lostReason = lostReason;
    await lead.save();
    return lead;
  }

  async findAll(): Promise<LeadDocument[]> {
    return this.leadModel
      .find()
      .populate('customer')
      .populate('interestedVehicle', 'stockNumber make model year sellingPrice status images category vehicleType engineCapacity')
      .populate('preferredBranch')
      .populate('bookingId')
      .populate('invoiceId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByCustomer(customerId: string): Promise<LeadDocument[]> {
    return this.leadModel
      .find({ customer: customerId })
      .populate('interestedVehicle', 'stockNumber make model year sellingPrice status images category vehicleType engineCapacity')
      .populate('preferredBranch')
      .populate('bookingId')
      .populate('invoiceId')
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
      .populate('invoiceId')
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
