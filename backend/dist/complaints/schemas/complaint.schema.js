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
exports.ComplaintSchema = exports.Complaint = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Complaint = class Complaint {
    customer;
    vehicle;
    sale;
    priority;
    assignedStaff;
    description;
    resolution;
    status;
};
exports.Complaint = Complaint;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Customer', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Complaint.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Vehicle' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Complaint.prototype, "vehicle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Sale' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Complaint.prototype, "sale", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Complaint.prototype, "priority", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Complaint.prototype, "assignedStaff", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Complaint.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Complaint.prototype, "resolution", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Open' }),
    __metadata("design:type", String)
], Complaint.prototype, "status", void 0);
exports.Complaint = Complaint = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Complaint);
exports.ComplaintSchema = mongoose_1.SchemaFactory.createForClass(Complaint);
//# sourceMappingURL=complaint.schema.js.map