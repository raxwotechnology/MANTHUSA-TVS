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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadActivitySchema = exports.LeadActivity = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let LeadActivity = class LeadActivity {
    lead;
    performedBy;
    activityType;
    oldStatus;
    newStatus;
    description;
};
exports.LeadActivity = LeadActivity;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Lead', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], LeadActivity.prototype, "lead", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], LeadActivity.prototype, "performedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], LeadActivity.prototype, "activityType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], LeadActivity.prototype, "oldStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], LeadActivity.prototype, "newStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], LeadActivity.prototype, "description", void 0);
exports.LeadActivity = LeadActivity = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], LeadActivity);
exports.LeadActivitySchema = mongoose_1.SchemaFactory.createForClass(LeadActivity);
//# sourceMappingURL=lead-activity.schema.js.map