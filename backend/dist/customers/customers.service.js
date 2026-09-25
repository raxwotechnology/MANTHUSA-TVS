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
    constructor(customerModel) {
        this.customerModel = customerModel;
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
    __metadata("design:paramtypes", [mongoose_2.Model])
], CustomersService);
//# sourceMappingURL=customers.service.js.map