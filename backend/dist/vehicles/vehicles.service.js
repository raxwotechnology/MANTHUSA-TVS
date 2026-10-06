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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let VehiclesService = class VehiclesService {
    vehicleModel;
    constructor(vehicleModel) {
        this.vehicleModel = vehicleModel;
    }
    calculateFinancials(dto) {
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
    async create(createVehicleDto) {
        const payload = this.calculateFinancials(createVehicleDto);
        const createdVehicle = new this.vehicleModel(payload);
        return createdVehicle.save();
    }
    async findAll() {
        return this.vehicleModel.find().exec();
    }
    findPublicListings() {
        return this.vehicleModel.find({ status: 'Available' }).select('make model variant year manufacturingYear registeredYear vehicleType condition fuelType transmission driveType engineCapacity mileage color sellingPrice images mediaAngles horsepower torque seatingCapacity doors bodyType safetyFeatures entertainmentFeatures comfortFeatures customSpecifications status').sort({ createdAt: -1 }).lean().exec();
    }
    async findOne(id) {
        const vehicle = await this.vehicleModel.findById(id).exec();
        if (!vehicle) {
            throw new common_1.NotFoundException(`Vehicle #${id} not found`);
        }
        return vehicle;
    }
    async update(id, updateVehicleDto) {
        const vehicle = await this.vehicleModel.findById(id).exec();
        if (!vehicle)
            throw new common_1.NotFoundException(`Vehicle #${id} not found`);
        const { _id, createdAt, updatedAt, ...changes } = updateVehicleDto;
        Object.assign(vehicle, this.calculateFinancials({ ...vehicle.toObject(), ...changes }));
        return vehicle.save();
    }
    redactFinancials(vehicle, role) {
        if (!vehicle)
            return vehicle;
        const obj = typeof vehicle.toObject === 'function' ? vehicle.toObject() : { ...vehicle };
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
    async getQrCode(id) {
        const vehicle = await this.findOne(id);
        const text = `VEHICLE-VIN:${vehicle.chassisNumber || vehicle.stockNumber || vehicle._id}|MAKE:${vehicle.make}|MODEL:${vehicle.model}|PRICE:LKR ${vehicle.sellingPrice || 0}`;
        const encoded = encodeURIComponent(text);
        return {
            stockNumber: vehicle.stockNumber,
            vin: vehicle.chassisNumber,
            qrText: text,
            qrDataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="100%" height="100%" fill="white"/><text x="100" y="30" font-family="monospace" font-size="12" text-anchor="middle" fill="black">VEHICLE QR TAG</text><rect x="40" y="40" width="120" height="120" fill="none" stroke="black" stroke-width="4"/><rect x="55" y="55" width="30" height="30" fill="black"/><rect x="115" y="55" width="30" height="30" fill="black"/><rect x="55" y="115" width="30" height="30" fill="black"/><path d="M95,65 H105 V95 H95 Z M65,95 H95 V105 H65 Z M105,105 H135 V135 H105 Z" fill="black"/><text x="100" y="180" font-family="monospace" font-size="10" text-anchor="middle" fill="black">${vehicle.chassisNumber || vehicle.stockNumber}</text></svg>`
        };
    }
    async getBarcode(id) {
        const vehicle = await this.findOne(id);
        const code = (vehicle.chassisNumber || vehicle.stockNumber || String(vehicle._id)).slice(-12).toUpperCase();
        return {
            stockNumber: vehicle.stockNumber,
            vin: vehicle.chassisNumber,
            barcodeText: code,
            barcodeSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="80" viewBox="0 0 300 80"><rect width="100%" height="100%" fill="white"/><g fill="black"><rect x="20" y="10" width="4" height="45"/><rect x="28" y="10" width="2" height="45"/><rect x="34" y="10" width="6" height="45"/><rect x="44" y="10" width="2" height="45"/><rect x="50" y="10" width="4" height="45"/><rect x="58" y="10" width="8" height="45"/><rect x="70" y="10" width="2" height="45"/><rect x="76" y="10" width="6" height="45"/><rect x="86" y="10" width="4" height="45"/><rect x="94" y="10" width="2" height="45"/><rect x="100" y="10" width="8" height="45"/><rect x="112" y="10" width="4" height="45"/><rect x="120" y="10" width="2" height="45"/><rect x="126" y="10" width="6" height="45"/><rect x="136" y="10" width="4" height="45"/><rect x="144" y="10" width="2" height="45"/><rect x="150" y="10" width="8" height="45"/><rect x="162" y="10" width="4" height="45"/><rect x="170" y="10" width="2" height="45"/><rect x="176" y="10" width="6" height="45"/><rect x="186" y="10" width="4" height="45"/><rect x="194" y="10" width="2" height="45"/><rect x="200" y="10" width="8" height="45"/><rect x="212" y="10" width="4" height="45"/><rect x="220" y="10" width="2" height="45"/><rect x="226" y="10" width="6" height="45"/><rect x="236" y="10" width="4" height="45"/><rect x="244" y="10" width="2" height="45"/><rect x="250" y="10" width="8" height="45"/><rect x="262" y="10" width="4" height="45"/><rect x="270" y="10" width="4" height="45"/></g><text x="150" y="70" font-family="monospace" font-size="12" text-anchor="middle" fill="black">${code}</text></svg>`
        };
    }
    async remove(id) {
        const deletedVehicle = await this.vehicleModel.findByIdAndDelete(id).exec();
        if (!deletedVehicle) {
            throw new common_1.NotFoundException(`Vehicle #${id} not found`);
        }
        return deletedVehicle;
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Vehicle')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map