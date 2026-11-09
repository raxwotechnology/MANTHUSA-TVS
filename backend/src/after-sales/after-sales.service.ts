import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AfterSalesService {
  constructor(@InjectModel('AfterSales') private readonly model: Model<any>) {}
  create(input: any) {
    if (!input.sale || !input.customer) throw new BadRequestException('Sale and customer references are required.');
    return new this.model(input).save();
  }
  findAll() { return this.model.find().populate('sale').populate('customer').sort({ nextFollowUp: 1 }).exec(); }
  async update(id: string, input: any) {
    const item = await this.model.findByIdAndUpdate(id, input, { new: true, runValidators: true }).exec();
    if (!item) throw new NotFoundException(`After-sales record ${id} not found.`);
    return item;
  }
  async getMta6Form(id: string) {
    const record = await this.model.findById(id).populate({ path: 'sale', populate: { path: 'vehicle' } }).populate('customer').exec();
    if (!record) throw new NotFoundException(`Record #${id} not found`);
    const customer = record.customer || {};
    const sale = record.sale || {};
    const vehicle = (sale.vehicle || {}) as any;

    return {
      formTitle: 'APPLICATION FOR REGISTRATION OF TRANSFER OF MOTOR VEHICLE (FORM MTA 6)',
      formNumber: 'MTA 6 (REV 2024)',
      department: 'DEPARTMENT OF MOTOR TRAFFIC - SRI LANKA',
      transferor: {
        name: record.rmvTransfer?.transferorName || 'AUTOSALES LANKA (PVT) LTD',
        nicOrReg: record.rmvTransfer?.transferorNic || 'PV-123456',
        address: record.rmvTransfer?.transferorAddress || '100 Galle Road, Colombo 03, Sri Lanka'
      },
      transferee: {
        name: record.rmvTransfer?.transfereeName || customer.name || 'N/A',
        nicOrPassport: record.rmvTransfer?.transfereeNic || customer.nicNumber || customer.passportNumber || 'N/A',
        address: record.rmvTransfer?.transfereeAddress || customer.address || 'N/A',
        phone: customer.phone || 'N/A',
        email: customer.email || 'N/A'
      },
      vehicle: {
        registrationNumber: record.rmvTransfer?.vehicleRegNo || vehicle.registrationNumber || 'UNREGISTERED / PERMIT',
        chassisNumber: record.rmvTransfer?.chassisNo || vehicle.chassisNumber || vehicle.vin || 'N/A',
        engineNumber: record.rmvTransfer?.engineNo || vehicle.engineNumber || 'N/A',
        make: vehicle.make || 'N/A',
        model: vehicle.model || 'N/A',
        manufacturingYear: vehicle.manufacturingYear || vehicle.year || 'N/A',
        fuelType: vehicle.fuelType || 'N/A',
        engineCapacity: vehicle.engineCapacity || 'N/A',
        color: vehicle.color || 'N/A'
      },
      transferDetails: {
        saleDate: sale.date || record.createdAt,
        rmvReference: record.rmvTransfer?.rmvRefNumber || `RMV-MTA6-${String(id).slice(-6).toUpperCase()}`,
        status: record.rmvTransfer?.mta6Status || 'Draft',
        notes: record.rmvTransfer?.notes || 'Vehicle transfer submitted to RMV Commissioner General.'
      }
    };
  }

  async getMta8Form(id: string) {
    const record = await this.model.findById(id).populate({ path: 'sale', populate: { path: 'vehicle' } }).populate('customer').exec();
    if (!record) throw new NotFoundException(`Record #${id} not found`);
    const customer = record.customer || {};
    const sale = record.sale || {};
    const vehicle = (sale.vehicle || {}) as any;

    return {
      formTitle: 'NOTICE OF CHANGE OF OWNERSHIP OF A MOTOR VEHICLE (FORM MTA 8)',
      formNumber: 'MTA 8 (NOTICE TO REGISTRAR OF MOTOR VEHICLES)',
      department: 'DEPARTMENT OF MOTOR TRAFFIC - SRI LANKA',
      registeredOwner: {
        name: record.rmvTransfer?.transferorName || 'AUTOSALES LANKA (PVT) LTD',
        nic: record.rmvTransfer?.transferorNic || 'PV-123456',
        address: record.rmvTransfer?.transferorAddress || '100 Galle Road, Colombo 03'
      },
      newOwner: {
        name: record.rmvTransfer?.transfereeName || customer.name || 'N/A',
        nic: record.rmvTransfer?.transfereeNic || customer.nicNumber || 'N/A',
        address: record.rmvTransfer?.transfereeAddress || customer.address || 'N/A'
      },
      vehicleDetails: {
        regNo: record.rmvTransfer?.vehicleRegNo || vehicle.registrationNumber || 'N/A',
        chassisNo: record.rmvTransfer?.chassisNo || vehicle.chassisNumber || 'N/A',
        engineNo: record.rmvTransfer?.engineNo || vehicle.engineNumber || 'N/A',
        makeModel: `${vehicle.make || ''} ${vehicle.model || ''}`.trim()
      },
      noticeDetails: {
        dateOfDisposal: sale.date || record.createdAt,
        status: record.rmvTransfer?.mta8Status || 'Pending Notice'
      }
    };
  }

  async remove(id: string) {
    const item = await this.model.findByIdAndDelete(id).exec();
    if (!item) throw new NotFoundException(`After-sales record ${id} not found.`);
    return item;
  }
}
