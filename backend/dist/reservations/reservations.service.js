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
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notifications_service_1 = require("../notifications/notifications.service");
let ReservationsService = class ReservationsService {
    reservationModel;
    vehicleModel;
    customerModel;
    notifications;
    constructor(reservationModel, vehicleModel, customerModel, notifications) {
        this.reservationModel = reservationModel;
        this.vehicleModel = vehicleModel;
        this.customerModel = customerModel;
        this.notifications = notifications;
    }
    async create(input) {
        const deposit = Number(input.reservationDeposit);
        if (!(0, mongoose_2.isValidObjectId)(input.customer) || !(0, mongoose_2.isValidObjectId)(input.vehicle) || !input.expiryDate || !Number.isFinite(deposit) || deposit < 0) {
            throw new common_1.BadRequestException('Customer, vehicle, expiry date and a non-negative deposit are required.');
        }
        if (!await this.customerModel.exists({ _id: input.customer }))
            throw new common_1.NotFoundException('Customer not found.');
        const vehicle = await this.vehicleModel.findById(input.vehicle).exec();
        if (!vehicle)
            throw new common_1.NotFoundException('Vehicle not found.');
        if (vehicle.status === 'Reserved') {
            const expired = await this.reservationModel.findOne({ vehicle: vehicle._id, status: 'Active', expiryDate: { $lte: new Date() } }).exec();
            if (expired) {
                expired.status = 'Expired';
                await expired.save();
                vehicle.status = 'Available';
                await vehicle.save();
            }
        }
        if (vehicle.status !== 'Available')
            throw new common_1.BadRequestException('Only available vehicles can be reserved.');
        const expiryDate = new Date(input.expiryDate);
        if (Number.isNaN(expiryDate.getTime()) || expiryDate <= new Date())
            throw new common_1.BadRequestException('Expiry date must be in the future.');
        const reservation = await new this.reservationModel({ ...input, reservationDeposit: deposit, status: 'Active', reservationId: input.reservationId || `RES-${Date.now()}` }).save();
        vehicle.status = 'Reserved';
        await vehicle.save();
        await this.notifications.create({ title: 'Vehicle reserved', message: `Vehicle ${vehicle.stockNumber} has been reserved.`, channel: 'in-app', entityType: 'Reservation', entityId: String(reservation._id) }).catch(() => undefined);
        return reservation;
    }
    findAll() {
        return this.reservationModel.find().populate('customer').populate('vehicle').sort({ createdAt: -1 }).exec();
    }
    async update(id, input) {
        const reservation = await this.reservationModel.findById(id).exec();
        if (!reservation)
            throw new common_1.NotFoundException(`Reservation ${id} not found.`);
        if (input.status && input.status !== reservation.status) {
            if (reservation.status !== 'Active')
                throw new common_1.BadRequestException('Only active reservations can change status.');
            if (!['Cancelled', 'Expired'].includes(input.status))
                throw new common_1.BadRequestException('Reservations are converted to sales through the sale workflow.');
        }
        if (input.status === 'Cancelled' || input.status === 'Expired') {
            const vehicle = await this.vehicleModel.findById(reservation.vehicle).exec();
            if (vehicle?.status === 'Reserved') {
                vehicle.status = 'Available';
                await vehicle.save();
            }
        }
        Object.assign(reservation, input);
        return reservation.save();
    }
    async remove(id) {
        const reservation = await this.reservationModel.findByIdAndDelete(id).exec();
        if (!reservation)
            throw new common_1.NotFoundException(`Reservation ${id} not found.`);
        if (reservation.status === 'Active') {
            const vehicle = await this.vehicleModel.findById(reservation.vehicle).exec();
            if (vehicle?.status === 'Reserved') {
                vehicle.status = 'Available';
                await vehicle.save();
            }
        }
        return reservation;
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Reservation')),
    __param(1, (0, mongoose_1.InjectModel)('Vehicle')),
    __param(2, (0, mongoose_1.InjectModel)('Customer')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        notifications_service_1.NotificationsService])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map