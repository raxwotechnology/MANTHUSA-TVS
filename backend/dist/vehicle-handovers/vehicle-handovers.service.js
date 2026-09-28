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
exports.VehicleHandoversService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let VehicleHandoversService = class VehicleHandoversService {
    handovers;
    sales;
    constructor(handovers, sales) {
        this.handovers = handovers;
        this.sales = sales;
    }
    async create(input) {
        if (!input.sale || !input.vehicle || !input.customer)
            throw new common_1.BadRequestException('Sale, vehicle and customer are required.');
        const sale = await this.sales.findById(input.sale).exec();
        if (!sale)
            throw new common_1.NotFoundException('Sale not found.');
        if (!['Confirmed', 'Completed'].includes(sale.status))
            throw new common_1.BadRequestException('Only confirmed sales can be handed over.');
        return new this.handovers(input).save();
    }
    findAll() { return this.handovers.find().populate('sale').populate('vehicle').populate('customer').sort({ createdAt: -1 }).exec(); }
    async update(id, input) {
        const handover = await this.handovers.findById(id).exec();
        if (!handover)
            throw new common_1.NotFoundException(`Handover ${id} not found.`);
        Object.assign(handover, input);
        if (input.status === 'Completed') {
            const required = ['vehicleInspection', 'keys', 'spareKey', 'cr', 'insurance', 'serviceBook', 'userManual', 'accessories', 'numberPlates', 'customerSignature'];
            if (!required.every((key) => handover.checklist?.[key] === true))
                throw new common_1.BadRequestException('Complete all handover checklist items before closing the handover.');
            const sale = await this.sales.findById(handover.sale).exec();
            if (sale) {
                sale.status = 'Completed';
                await sale.save();
            }
        }
        return handover.save();
    }
};
exports.VehicleHandoversService = VehicleHandoversService;
exports.VehicleHandoversService = VehicleHandoversService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('VehicleHandover')),
    __param(1, (0, mongoose_1.InjectModel)('Sale')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], VehicleHandoversService);
//# sourceMappingURL=vehicle-handovers.service.js.map