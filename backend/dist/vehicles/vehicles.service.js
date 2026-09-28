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
        const totalInvestment = dto.totalInvestment && Number(dto.totalInvestment) > 0 ? Number(dto.totalInvestment) : calculatedInvestment;
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
        const payload = this.calculateFinancials(updateVehicleDto);
        const existingVehicle = await this.vehicleModel.findByIdAndUpdate(id, payload, { new: true }).exec();
        if (!existingVehicle) {
            throw new common_1.NotFoundException(`Vehicle #${id} not found`);
        }
        return existingVehicle;
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