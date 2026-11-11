import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { VehicleDocument } from './schemas/vehicle.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class VehiclesService {
  private publicVehiclesCache: any[] | null = null;
  private publicCacheExpiry = 0;

  invalidatePublicCache() {
    this.publicVehiclesCache = null;
    this.publicCacheExpiry = 0;
  }

  constructor(
    @InjectModel('Vehicle') private vehicleModel: Model<VehicleDocument>,
    @InjectModel('Sale') private saleModel: Model<any>,
    @InjectModel('Customer') private customerModel: Model<any>,
    private readonly notifications: NotificationsService,
  ) {}

  private calculateFinancials(dto: any) {
    const purchase = Number(dto.purchasePrice || 0);
    const importCost = Number(dto.importCost || 0);
    const transport = Number(dto.transportCost || 0);
    const repair = Number(dto.repairCost || 0);
    const detailing = Number(dto.detailingCost || 0);
    const registration = Number(dto.registrationCost || 0);
    const insurance = Number(dto.insuranceCost || 0);
    const ad = Number(dto.advertisementCost || 0);
    const other = Number(dto.otherCosts || 0);

    const calculatedInvestment = purchase + importCost + transport + repair + detailing + registration + insurance + ad + other;
    const totalInvestment = calculatedInvestment > 0 ? calculatedInvestment : Number(dto.totalInvestment || purchase);
    const sellingPrice = Number(dto.sellingPrice || 0);
    const expectedProfit = sellingPrice > 0 ? sellingPrice - totalInvestment : Number(dto.expectedProfit || 0);

    return { ...dto, totalInvestment, expectedProfit };
  }

  async create(createVehicleDto: any): Promise<VehicleDocument> {
    const payload = this.calculateFinancials(createVehicleDto);
    if (!payload.stockNumber) {
      payload.stockNumber = `TVS-${Date.now().toString().slice(-6)}`;
    }
    if (!payload.make) {
      payload.make = 'TVS';
    }
    const createdVehicle = new this.vehicleModel(payload);
    const saved = await createdVehicle.save();
    this.invalidatePublicCache();
    return saved;
  }

  async findAll(): Promise<VehicleDocument[]> {
    return this.vehicleModel.find().populate('branch').sort({ createdAt: -1 }).exec();
  }

  async findPublicListings() {
    const now = Date.now();
    if (this.publicVehiclesCache && now < this.publicCacheExpiry) {
      return this.publicVehiclesCache;
    }

    const data = await this.vehicleModel
      .find({
        $or: [
          { status: { $in: [/^available$/i, /^in stock$/i, /^booking pending$/i] } },
          { isPublished: true },
        ],
      })
      .select(
        'stockNumber roundNumber chassisNumber engineNumber make model variant category year manufacturingYear condition fuelType transmission engineCapacity engineType maxPower maxTorque coolingSystem fuelSystem startingSystem topSpeed mileage fuelTankCapacity frontBrake rearBrake brakingSystem frontSuspension rearSuspension wheelType tyreDimensions groundClearance seatHeight kerbWeight smartFeatures color variants colors branchStock sellingPrice images mediaAngles shortDescription description isFeatured status'
      )
      .sort({ isFeatured: -1, createdAt: -1 })
      .lean()
      .exec();

    this.publicVehiclesCache = data;
    this.publicCacheExpiry = now + 60 * 1000;
    return data;
  }

  async findOnePublic(idOrSlug: string): Promise<any> {
    let vehicle: any = null;
    if (isValidObjectId(idOrSlug)) {
      vehicle = await this.vehicleModel.findById(idOrSlug).lean().exec();
    }
    if (!vehicle) {
      vehicle = await this.vehicleModel.findOne({
        $or: [
          { stockNumber: idOrSlug },
          { registrationNumber: idOrSlug },
        ],
      }).lean().exec();
    }
    if (!vehicle) {
      const parts = idOrSlug.split('-');
      // Try last part as potential mongo id
      const possibleId = parts[parts.length - 1];
      if (isValidObjectId(possibleId)) {
        vehicle = await this.vehicleModel.findById(possibleId).lean().exec();
      }
      if (!vehicle && parts.length >= 2) {
        vehicle = await this.vehicleModel.findOne({
          model: new RegExp(parts.join(' ').replace(/tvs/i, '').trim(), 'i'),
        }).lean().exec();
      }
    }
    if (!vehicle) {
      throw new NotFoundException(`Motorcycle #${idOrSlug} not found`);
    }
    return this.redactFinancials(vehicle, 'Customer');
  }

  async findOne(id: string): Promise<VehicleDocument> {
    const vehicle = await this.vehicleModel.findById(id).populate('branch').exec();
    if (!vehicle) {
      throw new NotFoundException(`Motorcycle #${id} not found`);
    }
    return vehicle;
  }

  async update(id: string, updateVehicleDto: any): Promise<VehicleDocument> {
    const vehicle = await this.vehicleModel.findById(id).exec();
    if (!vehicle) throw new NotFoundException(`Motorcycle #${id} not found`);

    const isNewPlate =
      updateVehicleDto.registrationNumber &&
      updateVehicleDto.registrationNumber !== vehicle.registrationNumber;

    const { _id, createdAt, updatedAt, ...changes } = updateVehicleDto;
    Object.assign(vehicle, this.calculateFinancials({ ...vehicle.toObject(), ...changes }));
    const updatedVehicle = await vehicle.save();

    // Send SMS when a number plate is newly assigned
    if (isNewPlate) {
      try {
        const sale = await this.saleModel.findOne({ vehicle: id }).exec();
        if (sale) {
          const customer = await this.customerModel.findById(sale.customer).exec();
          if (customer && customer.phone) {
            const dealershipName = process.env.DEALERSHIP_NAME || 'MANTHUSA TVS';
            const smsMessage = `Dear ${customer.fullName}, great news! Your ${updatedVehicle.model} (Chassis No: ${updatedVehicle.chassisNumber || 'N/A'}) has been registered. Number Plate: ${updatedVehicle.registrationNumber}. Please visit ${dealershipName} to collect your motorcycle. - ${dealershipName}`;
            this.notifications.sendSms(customer.phone, smsMessage, 'NumberPlate').catch(() => undefined);
          }
        }
      } catch (_) { /* SMS failure must not block vehicle update */ }
    }

    this.invalidatePublicCache();
    return updatedVehicle;
  }

  async updateModelPrice(updateModelPriceDto: any) {
    const make = String(updateModelPriceDto.make || '').trim();
    const model = String(updateModelPriceDto.model || '').trim();
    const sellingPrice = Number(updateModelPriceDto.sellingPrice);

    if (!make || !model || !Number.isFinite(sellingPrice) || sellingPrice < 0) {
      throw new BadRequestException('Make, model and a valid selling price are required');
    }

    const result = await this.vehicleModel.updateMany(
      {
        make: new RegExp(`^${make.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
        model: new RegExp(`^${model.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
      },
      [
        {
          $set: {
            sellingPrice,
            expectedProfit: { $subtract: [sellingPrice, { $ifNull: ['$totalInvestment', 0] }] },
          },
        },
      ],
    );

    this.invalidatePublicCache();
    return {
      make,
      model,
      sellingPrice,
      updatedCount: result.modifiedCount,
    };
  }

  redactFinancials(vehicle: any, role?: string) {
    if (!vehicle) return vehicle;
    const obj = typeof vehicle.toObject === 'function' ? vehicle.toObject() : { ...vehicle };
    const r = (role || '').toLowerCase();
    const isRestricted = !r || r.includes('sales') || r.includes('executive') || r.includes('customer') || r.includes('operations');
    if (isRestricted) {
      delete obj.purchasePrice;
      delete obj.importCost;
      delete obj.transportCost;
      delete obj.repairCost;
      delete obj.detailingCost;
      delete obj.registrationCost;
      delete obj.insuranceCost;
      delete obj.advertisementCost;
      delete obj.otherCosts;
      delete obj.totalInvestment;
      delete obj.expectedProfit;
      delete obj.actualProfit;
      // Sensitive chassis and engine numbers hidden from customer and public
      if (!r || r.includes('customer')) {
        delete obj.chassisNumber;
        delete obj.engineNumber;
      }
    }
    return obj;
  }

  async getQrCode(id: string) {
    const vehicle = await this.findOne(id);
    const text = `TVS-MOTORCYCLE|VIN:${vehicle.chassisNumber || vehicle.stockNumber || vehicle._id}|MODEL:${vehicle.model}|PRICE:LKR ${vehicle.sellingPrice || 0}`;
    return {
      stockNumber: vehicle.stockNumber,
      vin: vehicle.chassisNumber,
      qrText: text,
      qrDataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="100%" height="100%" fill="white"/><text x="100" y="30" font-family="monospace" font-size="12" text-anchor="middle" fill="black">TVS MOTORCYCLE QR</text><rect x="40" y="40" width="120" height="120" fill="none" stroke="black" stroke-width="4"/><rect x="55" y="55" width="30" height="30" fill="black"/><rect x="115" y="55" width="30" height="30" fill="black"/><rect x="55" y="115" width="30" height="30" fill="black"/><path d="M95,65 H105 V95 H95 Z M65,95 H95 V105 H65 Z M105,105 H135 V135 H105 Z" fill="black"/><text x="100" y="180" font-family="monospace" font-size="10" text-anchor="middle" fill="black">${vehicle.stockNumber}</text></svg>`
    };
  }

  async getBarcode(id: string) {
    const vehicle = await this.findOne(id);
    const code = (vehicle.chassisNumber || vehicle.stockNumber || String(vehicle._id)).slice(-12).toUpperCase();
    return {
      stockNumber: vehicle.stockNumber,
      vin: vehicle.chassisNumber,
      barcodeText: code,
      barcodeSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="80" viewBox="0 0 300 80"><rect width="100%" height="100%" fill="white"/><g fill="black"><rect x="20" y="10" width="4" height="45"/><rect x="28" y="10" width="2" height="45"/><rect x="34" y="10" width="6" height="45"/><rect x="44" y="10" width="2" height="45"/><rect x="50" y="10" width="4" height="45"/><rect x="58" y="10" width="8" height="45"/><rect x="70" y="10" width="2" height="45"/><rect x="76" y="10" width="6" height="45"/><rect x="86" y="10" width="4" height="45"/><rect x="94" y="10" width="2" height="45"/><rect x="100" y="10" width="8" height="45"/><rect x="112" y="10" width="4" height="45"/><rect x="120" y="10" width="2" height="45"/><rect x="126" y="10" width="6" height="45"/><rect x="136" y="10" width="4" height="45"/><rect x="144" y="10" width="2" height="45"/><rect x="150" y="10" width="8" height="45"/><rect x="162" y="10" width="4" height="45"/><rect x="170" y="10" width="2" height="45"/><rect x="176" y="10" width="6" height="45"/><rect x="186" y="10" width="4" height="45"/><rect x="194" y="10" width="2" height="45"/><rect x="200" y="10" width="8" height="45"/><rect x="212" y="10" width="4" height="45"/><rect x="220" y="10" width="2" height="45"/><rect x="226" y="10" width="6" height="45"/><rect x="236" y="10" width="4" height="45"/><rect x="244" y="10" width="2" height="45"/><rect x="250" y="10" width="8" height="45"/><rect x="262" y="10" width="4" height="45"/><rect x="270" y="10" width="4" height="45"/></g><text x="150" y="70" font-family="monospace" font-size="12" text-anchor="middle" fill="black">${code}</text></svg>`
    };
  }

  async remove(id: string): Promise<any> {
    const deletedVehicle = await this.vehicleModel.findByIdAndDelete(id).exec();
    if (!deletedVehicle) {
      throw new NotFoundException(`Motorcycle #${id} not found`);
    }
    this.invalidatePublicCache();
    return deletedVehicle;
  }
}
