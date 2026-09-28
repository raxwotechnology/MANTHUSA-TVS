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
exports.TestDrivesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let TestDrivesService = class TestDrivesService {
    model;
    constructor(model) {
        this.model = model;
    }
    create(input) {
        if (!input.customer || !input.vehicle || !input.salesperson || !input.date)
            throw new common_1.BadRequestException('Customer, vehicle, salesperson and date are required.');
        return new this.model(input).save();
    }
    findAll() { return this.model.find().populate('customer').populate('vehicle').populate('salesperson').sort({ date: 1 }).exec(); }
    async update(id, input) {
        const item = await this.model.findByIdAndUpdate(id, input, { new: true, runValidators: true }).exec();
        if (!item)
            throw new common_1.NotFoundException(`Test drive ${id} not found.`);
        return item;
    }
};
exports.TestDrivesService = TestDrivesService;
exports.TestDrivesService = TestDrivesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('TestDrive')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TestDrivesService);
//# sourceMappingURL=test-drives.service.js.map