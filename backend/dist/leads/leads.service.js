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
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notifications_service_1 = require("../notifications/notifications.service");
let LeadsService = class LeadsService {
    leadModel;
    customerModel;
    notifications;
    constructor(leadModel, customerModel, notifications) {
        this.leadModel = leadModel;
        this.customerModel = customerModel;
        this.notifications = notifications;
    }
    async create(createLeadDto) {
        const leadId = createLeadDto.leadId || `LEAD-${Date.now()}`;
        const createdLead = new this.leadModel({ ...createLeadDto, leadId });
        const saved = await createdLead.save();
        await this.notifications.create({ title: 'New lead received', message: `A new lead ${leadId} was created.`, channel: 'in-app', entityType: 'Lead', entityId: String(saved._id) }).catch(() => undefined);
        return saved;
    }
    async createPublicInquiry(input) {
        const fullName = String(input.fullName || '').trim();
        const phone = String(input.phone || '').trim();
        if (fullName.length < 2 || phone.replace(/\D/g, '').length < 7 || !input.vehicle) {
            throw new common_1.BadRequestException('Name, valid phone number and vehicle are required.');
        }
        const vehicleId = String(input.vehicle);
        let customer = await this.customerModel.findOne({ phone }).exec();
        if (!customer)
            customer = await new this.customerModel({ fullName, phone, email: input.email, customerType: 'Individual' }).save();
        return this.create({ customer: customer._id, interestedVehicle: vehicleId, source: 'Website', status: 'New', priority: 'Medium', inquiryType: String(input.inquiryType || 'Details').slice(0, 40), inquiryMessage: String(input.message || '').slice(0, 1000), preferredDate: input.preferredDate || undefined });
    }
    async findAll() {
        return this.leadModel.find().populate('customer').populate('interestedVehicle', 'stockNumber make model year sellingPrice status').sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const lead = await this.leadModel.findById(id).populate('customer').exec();
        if (!lead) {
            throw new common_1.NotFoundException(`Lead #${id} not found`);
        }
        return lead;
    }
    async update(id, updateLeadDto) {
        const existingLead = await this.leadModel.findByIdAndUpdate(id, updateLeadDto, { new: true }).exec();
        if (!existingLead) {
            throw new common_1.NotFoundException(`Lead #${id} not found`);
        }
        return existingLead;
    }
    async remove(id) {
        const deletedLead = await this.leadModel.findByIdAndDelete(id).exec();
        if (!deletedLead) {
            throw new common_1.NotFoundException(`Lead #${id} not found`);
        }
        return deletedLead;
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Lead')),
    __param(1, (0, mongoose_1.InjectModel)('Customer')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        notifications_service_1.NotificationsService])
], LeadsService);
//# sourceMappingURL=leads.service.js.map