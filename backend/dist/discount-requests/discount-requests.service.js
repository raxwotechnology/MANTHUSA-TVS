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
exports.DiscountRequestsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let DiscountRequestsService = class DiscountRequestsService {
    requests;
    quotations;
    vehicles;
    constructor(requests, quotations, vehicles) {
        this.requests = requests;
        this.quotations = quotations;
        this.vehicles = vehicles;
    }
    async create(input, userId) {
        const requestedDiscount = Number(input.requestedDiscount);
        if (!userId || !input.quotation || !Number.isFinite(requestedDiscount) || requestedDiscount <= 0)
            throw new common_1.BadRequestException('Quotation and a positive requested discount are required.');
        const quotation = await this.quotations.findById(input.quotation).exec();
        if (!quotation)
            throw new common_1.NotFoundException('Quotation not found.');
        if (requestedDiscount >= Number(quotation.vehiclePrice || 0))
            throw new common_1.BadRequestException('Requested discount must be less than the vehicle price.');
        return new this.requests({ ...input, requestedBy: userId, requestedDiscount, status: 'Pending' }).save();
    }
    findAll() { return this.requests.find().populate('quotation').populate('requestedBy', 'name').populate('approvedBy', 'name').sort({ createdAt: -1 }).exec(); }
    async decide(id, input, approverId, role) {
        if (!['Admin', 'Admin / Owner'].includes(role))
            throw new common_1.ForbiddenException('Only an admin can approve a discount.');
        const request = await this.requests.findById(id).exec();
        if (!request)
            throw new common_1.NotFoundException('Discount request not found.');
        if (request.status !== 'Pending')
            throw new common_1.BadRequestException('This discount request has already been reviewed.');
        if (!['Approved', 'Rejected'].includes(input.status))
            throw new common_1.BadRequestException('Decision must be Approved or Rejected.');
        if (input.status === 'Approved') {
            const quotation = await this.quotations.findById(request.quotation).exec();
            if (!quotation)
                throw new common_1.NotFoundException('Quotation not found.');
            const vehicle = await this.vehicles.findById(quotation.vehicle).exec();
            if (vehicle?.minimumSellingPrice && quotation.vehiclePrice - request.requestedDiscount < vehicle.minimumSellingPrice)
                throw new common_1.BadRequestException('Approved discount would put the vehicle below its minimum selling price.');
            quotation.discount = request.requestedDiscount;
            quotation.totalAmount = quotation.vehiclePrice - quotation.discount + quotation.registrationFee + quotation.insuranceFee + quotation.otherCharges;
            await quotation.save();
        }
        request.status = input.status;
        request.approvedBy = approverId;
        request.approvalDate = new Date();
        return request.save();
    }
};
exports.DiscountRequestsService = DiscountRequestsService;
exports.DiscountRequestsService = DiscountRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('DiscountRequest')),
    __param(1, (0, mongoose_1.InjectModel)('Quotation')),
    __param(2, (0, mongoose_1.InjectModel)('Vehicle')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DiscountRequestsService);
//# sourceMappingURL=discount-requests.service.js.map