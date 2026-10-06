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
exports.AfterSalesSchema = exports.AfterSales = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let AfterSales = class AfterSales {
    sale;
    customer;
    customerFeedback;
    reminders;
    warrantyInfo;
    freeServices;
    rmvTransfer;
    nextFollowUp;
};
exports.AfterSales = AfterSales;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Sale', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AfterSales.prototype, "sale", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Customer', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AfterSales.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AfterSales.prototype, "customerFeedback", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], AfterSales.prototype, "reminders", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], AfterSales.prototype, "warrantyInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)([{
            serviceNumber: Number,
            milestoneKm: Number,
            dueDate: Date,
            status: { type: String, default: 'Scheduled' },
            completedDate: Date,
            notes: String
        }]),
    __metadata("design:type", Array)
], AfterSales.prototype, "freeServices", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], AfterSales.prototype, "rmvTransfer", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], AfterSales.prototype, "nextFollowUp", void 0);
exports.AfterSales = AfterSales = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], AfterSales);
exports.AfterSalesSchema = mongoose_1.SchemaFactory.createForClass(AfterSales);
//# sourceMappingURL=after-sales.schema.js.map