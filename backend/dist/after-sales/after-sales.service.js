"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterSalesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let AfterSalesService = class AfterSalesService {
    model;
    constructor(model) {
        this.model = model;
    }
    create(input) { return new this.model(input).save(); }
    findAll() { return this.model.find().populate('sale').populate('customer').sort({ nextFollowUp: 1 }).exec(); }
    async update(id, input) {
        const item = await this.model.findByIdAndUpdate(id, input, { new: true, runValidators: true }).exec();
        if (!item)
            throw new common_1.NotFoundException(`After-sales record ${id} not found.`);
        return item;
    }
    async getMta6Form(id) {
        const record = await this.model.findById(id).populate({ path: 'sale', populate: { path: 'vehicle' } }).populate('customer').exec();
        if (!record)
            throw new common_1.NotFoundException(`Record #${id} not found`);
        const customer = record.customer || {};
        const sale = record.sale || {};
        const vehicle = (sale.vehicle || {});
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
    async getMta8Form(id) {
        const record = await this.model.findById(id).populate({ path: 'sale', populate: { path: 'vehicle' } }).populate('customer').exec();
        if (!record)
            throw new common_1.NotFoundException(`Record #${id} not found`);
        const customer = record.customer || {};
        const sale = record.sale || {};
        const vehicle = (sale.vehicle || {});
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
    async remove(id) {
        const item = await this.model.findByIdAndDelete(id).exec();
        if (!item)
            throw new common_1.NotFoundException(`After-sales record ${id} not found.`);
        return item;
    }
};
exports.AfterSalesService = AfterSalesService;
exports.AfterSalesService = AfterSalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('AfterSales')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AfterSalesService);
//# sourceMappingURL=after-sales.service.js.map