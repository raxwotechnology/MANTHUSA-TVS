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
exports.LeasingPartnerSchema = exports.LeasingPartner = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let LeasingPartner = class LeasingPartner {
    name;
    contactPerson;
    phone;
    email;
    address;
    defaultInterestRate;
    maxLoanTenureMonths;
    notes;
};
exports.LeasingPartner = LeasingPartner;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], LeasingPartner.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], LeasingPartner.prototype, "contactPerson", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], LeasingPartner.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], LeasingPartner.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], LeasingPartner.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], LeasingPartner.prototype, "defaultInterestRate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], LeasingPartner.prototype, "maxLoanTenureMonths", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], LeasingPartner.prototype, "notes", void 0);
exports.LeasingPartner = LeasingPartner = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], LeasingPartner);
exports.LeasingPartnerSchema = mongoose_1.SchemaFactory.createForClass(LeasingPartner);
//# sourceMappingURL=leasing-partner.schema.js.map