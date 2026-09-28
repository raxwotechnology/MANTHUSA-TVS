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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let CustomersService = class CustomersService {
    customerModel;
    leads;
    followUps;
    testDrives;
    quotations;
    reservations;
    payments;
    sales;
    handovers;
    complaints;
    afterSales;
    constructor(customerModel, leads, followUps, testDrives, quotations, reservations, payments, sales, handovers, complaints, afterSales) {
        this.customerModel = customerModel;
        this.leads = leads;
        this.followUps = followUps;
        this.testDrives = testDrives;
        this.quotations = quotations;
        this.reservations = reservations;
        this.payments = payments;
        this.sales = sales;
        this.handovers = handovers;
        this.complaints = complaints;
        this.afterSales = afterSales;
    }
    async create(createCustomerDto) {
        const createdCustomer = new this.customerModel(createCustomerDto);
        return createdCustomer.save();
    }
    async findAll() {
        return this.customerModel.find().sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const customer = await this.customerModel.findById(id).exec();
        if (!customer) {
            throw new common_1.NotFoundException(`Customer #${id} not found`);
        }
        return customer;
    }
    async timeline(id) {
        const customer = await this.customerModel.findById(id).exec();
        if (!customer)
            throw new common_1.NotFoundException(`Customer #${id} not found`);
        const queries = [
            ['Lead', this.leads.find({ customer: id }).populate('interestedVehicle')],
            ['Follow-up', this.followUps.find({ customer: id }).populate('vehicle')],
            ['Test drive', this.testDrives.find({ customer: id }).populate('vehicle')],
            ['Quotation', this.quotations.find({ customer: id }).populate('vehicle')],
            ['Reservation', this.reservations.find({ customer: id }).populate('vehicle')],
            ['Payment', this.payments.find({ customer: id }).populate('sale')],
            ['Sale', this.sales.find({ customer: id }).populate('vehicle')],
            ['Handover', this.handovers.find({ customer: id }).populate('vehicle')],
            ['Complaint', this.complaints.find({ customer: id })],
            ['After-sales', this.afterSales.find({ customer: id })],
        ];
        const records = await Promise.all(queries.map(async ([type, query]) => (await query.sort({ createdAt: -1 }).limit(100).exec()).map((record) => ({ type, record }))));
        return records.flat().map(({ type, record }) => {
            const related = record.vehicle || record.interestedVehicle;
            const vehicle = related ? `${related.make || ''} ${related.model || ''}`.trim() : '';
            const date = record.followUpDate || record.date || record.saleDate || record.paymentDate || record.handoverDate || record.nextFollowUp || record.createdAt;
            const detail = record.status || record.feedback || record.notes || record.description || record.customerFeedback || record.invoiceNumber || '';
            return { type, date, detail: `${vehicle ? `${vehicle} · ` : ''}${detail}`, id: record._id };
        }).sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    }
    async update(id, updateCustomerDto) {
        const existingCustomer = await this.customerModel.findByIdAndUpdate(id, updateCustomerDto, { new: true }).exec();
        if (!existingCustomer) {
            throw new common_1.NotFoundException(`Customer #${id} not found`);
        }
        return existingCustomer;
    }
    async remove(id) {
        const deletedCustomer = await this.customerModel.findByIdAndDelete(id).exec();
        if (!deletedCustomer) {
            throw new common_1.NotFoundException(`Customer #${id} not found`);
        }
        return deletedCustomer;
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Customer')),
    __param(1, (0, mongoose_1.InjectModel)('Lead')),
    __param(2, (0, mongoose_1.InjectModel)('FollowUp')),
    __param(3, (0, mongoose_1.InjectModel)('TestDrive')),
    __param(4, (0, mongoose_1.InjectModel)('Quotation')),
    __param(5, (0, mongoose_1.InjectModel)('Reservation')),
    __param(6, (0, mongoose_1.InjectModel)('Payment')),
    __param(7, (0, mongoose_1.InjectModel)('Sale')),
    __param(8, (0, mongoose_1.InjectModel)('VehicleHandover')),
    __param(9, (0, mongoose_1.InjectModel)('Complaint')),
    __param(10, (0, mongoose_1.InjectModel)('AfterSales')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model, mongoose_2.Model,
        mongoose_2.Model, mongoose_2.Model,
        mongoose_2.Model, mongoose_2.Model,
        mongoose_2.Model, mongoose_2.Model,
        mongoose_2.Model, mongoose_2.Model])
], CustomersService);
//# sourceMappingURL=customers.service.js.map