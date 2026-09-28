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
exports.LeadActivitiesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let LeadActivitiesService = class LeadActivitiesService {
    model;
    constructor(model) {
        this.model = model;
    }
    create(input) {
        if (!input.lead || !input.performedBy || !input.activityType)
            throw new common_1.BadRequestException('Lead, user and activity type are required.');
        return new this.model(input).save();
    }
    findAll(lead) { return this.model.find(lead ? { lead } : {}).populate('lead').populate('performedBy', 'name').sort({ createdAt: -1 }).exec(); }
};
exports.LeadActivitiesService = LeadActivitiesService;
exports.LeadActivitiesService = LeadActivitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('LeadActivity')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LeadActivitiesService);
//# sourceMappingURL=lead-activities.service.js.map