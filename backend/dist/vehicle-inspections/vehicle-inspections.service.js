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
exports.VehicleInspectionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let VehicleInspectionsService = class VehicleInspectionsService {
    inspections;
    vehicles;
    constructor(inspections, vehicles) {
        this.inspections = inspections;
        this.vehicles = vehicles;
    }
    async create(input) {
        if (!input.vehicle)
            throw new common_1.BadRequestException('Vehicle is required.');
        const vehicle = await this.vehicles.findById(input.vehicle).exec();
        if (!vehicle)
            throw new common_1.NotFoundException('Vehicle not found.');
        const inspection = await new this.inspections(input).save();
        vehicle.status = input.result === 'Failed' ? 'Under Repair' : 'Under Inspection';
        if (input.result === 'Passed')
            vehicle.status = 'Available';
        await vehicle.save();
        return inspection;
    }
    findAll() { return this.inspections.find().populate('vehicle').populate('inspector').sort({ createdAt: -1 }).exec(); }
    async update(id, input) {
        const item = await this.inspections.findByIdAndUpdate(id, input, { new: true, runValidators: true }).exec();
        if (!item)
            throw new common_1.NotFoundException(`Inspection ${id} not found.`);
        if (input.result) {
            const vehicle = await this.vehicles.findById(item.vehicle).exec();
            if (vehicle) {
                vehicle.status = input.result === 'Passed' ? 'Available' : input.result === 'Failed' ? 'Under Repair' : 'Under Inspection';
                await vehicle.save();
            }
        }
        return item;
    }
    async remove(id) {
        const item = await this.inspections.findByIdAndDelete(id).exec();
        if (!item)
            throw new common_1.NotFoundException(`Inspection ${id} not found.`);
        const vehicle = await this.vehicles.findById(item.vehicle).exec();
        if (vehicle && ['Under Inspection', 'Under Repair'].includes(vehicle.status)) {
            vehicle.status = 'Available';
            await vehicle.save();
        }
        return item;
    }
};
exports.VehicleInspectionsService = VehicleInspectionsService;
exports.VehicleInspectionsService = VehicleInspectionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('VehicleInspection')),
    __param(1, (0, mongoose_1.InjectModel)('Vehicle')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], VehicleInspectionsService);
//# sourceMappingURL=vehicle-inspections.service.js.map