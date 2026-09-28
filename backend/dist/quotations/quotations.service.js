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
exports.QuotationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let QuotationsService = class QuotationsService {
    quotationModel;
    constructor(quotationModel) {
        this.quotationModel = quotationModel;
    }
    async create(createQuotationDto) {
        if (!createQuotationDto.customer || !createQuotationDto.vehicle)
            throw new common_1.BadRequestException('Customer and vehicle are required.');
        const vehiclePrice = Number(createQuotationDto.vehiclePrice || 0);
        const discount = Number(createQuotationDto.discount || 0);
        const registrationFee = Number(createQuotationDto.registrationFee || 0);
        const insuranceFee = Number(createQuotationDto.insuranceFee || 0);
        const otherCharges = Number(createQuotationDto.otherCharges || createQuotationDto.additionalCharges || 0);
        if (vehiclePrice <= 0 || discount < 0 || discount >= vehiclePrice)
            throw new common_1.BadRequestException('Quotation pricing is invalid.');
        const createdQuotation = new this.quotationModel({
            ...createQuotationDto,
            quotationNumber: createQuotationDto.quotationNumber || `QT-${Date.now()}`,
            vehiclePrice, discount, registrationFee, insuranceFee, otherCharges,
            totalAmount: vehiclePrice - discount + registrationFee + insuranceFee + otherCharges,
        });
        return createdQuotation.save();
    }
    async findAll() {
        return this.quotationModel.find().populate('customer').populate('vehicle').sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const quotation = await this.quotationModel.findById(id).populate('customer').populate('vehicle').exec();
        if (!quotation) {
            throw new common_1.NotFoundException(`Quotation #${id} not found`);
        }
        return quotation;
    }
    async update(id, updateQuotationDto) {
        const existingQuotation = await this.quotationModel.findByIdAndUpdate(id, updateQuotationDto, { new: true }).exec();
        if (!existingQuotation) {
            throw new common_1.NotFoundException(`Quotation #${id} not found`);
        }
        return existingQuotation;
    }
    async remove(id) {
        const deletedQuotation = await this.quotationModel.findByIdAndDelete(id).exec();
        if (!deletedQuotation) {
            throw new common_1.NotFoundException(`Quotation #${id} not found`);
        }
        return deletedQuotation;
    }
};
exports.QuotationsService = QuotationsService;
exports.QuotationsService = QuotationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Quotation')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], QuotationsService);
//# sourceMappingURL=quotations.service.js.map