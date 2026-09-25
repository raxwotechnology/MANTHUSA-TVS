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
let LeadsService = class LeadsService {
    leadModel;
    constructor(leadModel) {
        this.leadModel = leadModel;
    }
    async create(createLeadDto) {
        const createdLead = new this.leadModel(createLeadDto);
        return createdLead.save();
    }
    async findAll() {
        return this.leadModel.find().populate('customer').sort({ createdAt: -1 }).exec();
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
    __metadata("design:paramtypes", [mongoose_2.Model])
], LeadsService);
//# sourceMappingURL=leads.service.js.map