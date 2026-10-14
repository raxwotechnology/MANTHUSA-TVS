import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { VehicleDocument } from './schemas/vehicle.schema';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel('Vehicle') private vehicleModel: Model<VehicleDocument>
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
    const totalInvestment = calculatedInvestment;
    const sellingPrice = Number(dto.sellingPrice || 0);
    const expectedProfit = sellingPrice > 0 ? sellingPrice - totalInvestment : Number(dto.expectedProfit || 0);

    return { ...dto, totalInvestment, expectedProfit };
  }

  async create(createVehicleDto: any): Promise<VehicleDocument> {
    const payload = this.calculateFinancials(createVehicleDto);
    const createdVehicle = new this.vehicleModel(payload);
    return createdVehicle.save();
  }

  async findAll(): Promise<VehicleDocument[]> {
    return this.vehicleModel.find().exec();
  }

  findPublicListings() {
    return this.vehicleModel
      .find({
        status: { $in: [/^available$/i, /^purchased$/i, /^under inspection$/i, /^in stock$/i] },
      })
      .select('make model variant year manufacturingYear registeredYear vehicleType condition fuelType transmission driveType engineCapacity mileage color sellingPrice images mediaAngles horsepower torque seatingCapacity doors bodyType dimensions weight fuelTankCapacity safetyFeatures entertainmentFeatures comfortFeatures customSpecifications status')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
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
      if (parts.length >= 2) {
        vehicle = await this.vehicleModel.findOne({
          make: new RegExp(`^${parts[0]}$`, 'i'),
          model: new RegExp(`^${parts[1]}$`, 'i'),
        }).lean().exec();
      }
    }
    if (!vehicle) {
      throw new NotFoundException(`Vehicle #${idOrSlug} not found`);
    }
    return this.redactFinancials(vehicle, 'Customer');
  }

  async findOne(id: string): Promise<VehicleDocument> {
    const vehicle = await this.vehicleModel.findById(id).exec();
    if (!vehicle) {
      throw new NotFoundException(`Vehicle #${id} not found`);
    }
    return vehicle;
  }

  async update(id: string, updateVehicleDto: any): Promise<VehicleDocument> {
    const vehicle = await this.vehicleModel.findById(id).exec();
    if (!vehicle) throw new NotFoundException(`Vehicle #${id} not found`);
    const { _id, createdAt, updatedAt, ...changes } = updateVehicleDto;
    Object.assign(vehicle, this.calculateFinancials({ ...vehicle.toObject(), ...changes }));
    return vehicle.save();
  }

  redactFinancials(vehicle: any, role?: string) {
    if (!vehicle) return vehicle;
    const obj = typeof vehicle.toObject === 'function' ? vehicle.toObject() : { ...vehicle };
    // Non-functional req B & Security: Sales Executives are restricted from viewing Buying Price / Profit Details
    if (role && (role.toLowerCase().includes('sales') || role.toLowerCase().includes('executive') || role.toLowerCase().includes('customer'))) {
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
    }
    return obj;
  }

  async getQrCode(id: string) {
    const vehicle = await this.findOne(id);
    const text = `VEHICLE-VIN:${vehicle.chassisNumber || vehicle.stockNumber || vehicle._id}|MAKE:${vehicle.make}|MODEL:${vehicle.model}|PRICE:LKR ${vehicle.sellingPrice || 0}`;
    // Generate clean SVG Data URL for QR Code representation
    const encoded = encodeURIComponent(text);
    return {
      stockNumber: vehicle.stockNumber,
      vin: vehicle.chassisNumber,
      qrText: text,
      qrDataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="100%" height="100%" fill="white"/><text x="100" y="30" font-family="monospace" font-size="12" text-anchor="middle" fill="black">VEHICLE QR TAG</text><rect x="40" y="40" width="120" height="120" fill="none" stroke="black" stroke-width="4"/><rect x="55" y="55" width="30" height="30" fill="black"/><rect x="115" y="55" width="30" height="30" fill="black"/><rect x="55" y="115" width="30" height="30" fill="black"/><path d="M95,65 H105 V95 H95 Z M65,95 H95 V105 H65 Z M105,105 H135 V135 H105 Z" fill="black"/><text x="100" y="180" font-family="monospace" font-size="10" text-anchor="middle" fill="black">${vehicle.chassisNumber || vehicle.stockNumber}</text></svg>`
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
      throw new NotFoundException(`Vehicle #${id} not found`);
    }
    return deletedVehicle;
  }
}
