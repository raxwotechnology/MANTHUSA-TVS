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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notifications_service_1 = require("../notifications/notifications.service");
let SalesService = class SalesService {
    saleModel;
    vehicleModel;
    customerModel;
    reservations;
    notifications;
    constructor(saleModel, vehicleModel, customerModel, reservations, notifications) {
        this.saleModel = saleModel;
        this.vehicleModel = vehicleModel;
        this.customerModel = customerModel;
        this.reservations = reservations;
        this.notifications = notifications;
    }
    async create(createSaleDto) {
        if (!createSaleDto.customer || !createSaleDto.vehicle)
            throw new common_1.BadRequestException('Customer and vehicle are required.');
        if (!(0, mongoose_2.isValidObjectId)(createSaleDto.customer) || !(0, mongoose_2.isValidObjectId)(createSaleDto.vehicle))
            throw new common_1.BadRequestException('Customer or vehicle ID is invalid.');
        const customer = await this.customerModel.findById(createSaleDto.customer).exec();
        if (!customer)
            throw new common_1.NotFoundException('Customer not found.');
        const vehicle = await this.vehicleModel.findById(createSaleDto.vehicle).exec();
        if (!vehicle)
            throw new common_1.NotFoundException('Vehicle not found.');
        if (!['Available', 'Reserved'].includes(vehicle.status))
            throw new common_1.BadRequestException('Vehicle is not available for sale.');
        let reservation;
        if (vehicle.status === 'Reserved') {
            reservation = await this.reservations.findOne({ vehicle: vehicle._id, status: 'Active' }).exec();
            if (!reservation)
                throw new common_1.BadRequestException('This vehicle has no active reservation. Release it before recording a sale.');
            if (reservation && reservation.customer.toString() !== createSaleDto.customer.toString())
                throw new common_1.BadRequestException('This vehicle is reserved for a different customer.');
            if (reservation && reservation.expiryDate <= new Date()) {
                reservation.status = 'Expired';
                await reservation.save();
                vehicle.status = 'Available';
                await vehicle.save();
                throw new common_1.BadRequestException('The reservation has expired. Create a new reservation before continuing.');
            }
        }
        const vehiclePrice = Number(createSaleDto.vehiclePrice ?? vehicle.sellingPrice ?? 0);
        const discount = Number(createSaleDto.discount || 0);
        const additionalCharges = Number(createSaleDto.additionalCharges || 0);
        if (vehiclePrice <= 0 || discount < 0 || discount >= vehiclePrice || additionalCharges < 0)
            throw new common_1.BadRequestException('Sale pricing is invalid.');
        const finalAmount = vehiclePrice - discount + additionalCharges;
        const paidAmount = Number(createSaleDto.paidAmount || 0);
        if (paidAmount < 0 || paidAmount > finalAmount)
            throw new common_1.BadRequestException('Paid amount must be between zero and the sale total.');
        const invoiceNumber = createSaleDto.invoiceNumber || `INV-${Date.now()}`;
        const createdSale = await new this.saleModel({
            ...createSaleDto, branch: createSaleDto.branch || vehicle.branch || vehicle.location, invoiceNumber, vehiclePrice, discount, additionalCharges,
            finalAmount, paidAmount, balance: finalAmount - paidAmount,
            status: createSaleDto.status || 'Confirmed', saleDate: createSaleDto.saleDate || new Date(),
        }).save();
        vehicle.status = 'Sold';
        vehicle.sellingPrice = vehiclePrice;
        await vehicle.save();
        if (reservation) {
            reservation.status = 'ConvertedToSale';
            await reservation.save();
        }
        await this.notifications.create({ title: 'Sale recorded', message: `Invoice ${invoiceNumber} was created.`, channel: 'in-app', entityType: 'Sale', entityId: String(createdSale._id) }).catch(() => undefined);
        return createdSale;
    }
    async findAll() {
        return this.saleModel.find().populate('customer').populate('vehicle').sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const sale = await this.saleModel.findById(id).populate('customer').populate('vehicle').exec();
        if (!sale) {
            throw new common_1.NotFoundException(`Sale #${id} not found`);
        }
        return sale;
    }
    async update(id, updateSaleDto) {
        const existingSale = await this.saleModel.findById(id).exec();
        if (!existingSale) {
            throw new common_1.NotFoundException(`Sale #${id} not found`);
        }
        const vehiclePrice = Number(updateSaleDto.vehiclePrice ?? existingSale.vehiclePrice ?? 0);
        const discount = Number(updateSaleDto.discount ?? existingSale.discount ?? 0);
        const additionalCharges = Number(updateSaleDto.additionalCharges ?? existingSale.additionalCharges ?? 0);
        if (vehiclePrice <= 0 || discount < 0 || discount >= vehiclePrice || additionalCharges < 0) {
            throw new common_1.BadRequestException('Sale pricing is invalid.');
        }
        const finalAmount = vehiclePrice - discount + additionalCharges;
        const paidAmount = Number(updateSaleDto.paidAmount ?? existingSale.paidAmount ?? 0);
        if (paidAmount < 0 || paidAmount > finalAmount)
            throw new common_1.BadRequestException('Paid amount cannot exceed the updated sale total.');
        Object.assign(existingSale, updateSaleDto, { vehiclePrice, discount, additionalCharges, finalAmount, paidAmount, balance: finalAmount - paidAmount });
        if (existingSale.status === 'Cancelled' || existingSale.status === 'Refunded') {
            const vehicle = await this.vehicleModel.findById(existingSale.vehicle).exec();
            if (vehicle?.status === 'Sold') {
                vehicle.status = 'Available';
                await vehicle.save();
            }
        }
        await existingSale.save();
        return existingSale;
    }
    async remove(id) {
        const deletedSale = await this.saleModel.findByIdAndDelete(id).exec();
        if (!deletedSale) {
            throw new common_1.NotFoundException(`Sale #${id} not found`);
        }
        const vehicle = await this.vehicleModel.findById(deletedSale.vehicle).exec();
        if (vehicle?.status === 'Sold') {
            vehicle.status = 'Available';
            await vehicle.save();
        }
        return deletedSale;
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Sale')),
    __param(1, (0, mongoose_1.InjectModel)('Vehicle')),
    __param(2, (0, mongoose_1.InjectModel)('Customer')),
    __param(3, (0, mongoose_1.InjectModel)('Reservation')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        notifications_service_1.NotificationsService])
], SalesService);
//# sourceMappingURL=sales.service.js.map