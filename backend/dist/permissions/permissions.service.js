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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let PermissionsService = class PermissionsService {
    model;
    constructor(model) {
        this.model = model;
    }
    async set(input) {
        const { role, module, ...flags } = input;
        const allowed = ['canView', 'canCreate', 'canEdit', 'canDelete', 'canApprove', 'canExport'];
        const permission = Object.fromEntries(allowed.map((key) => [key, flags[key] === true]));
        return this.model.findOneAndUpdate({ role, module }, { $set: permission }, { new: true, upsert: true, runValidators: true }).populate('role').exec();
    }
    findAll() { return this.model.find().populate('role').sort({ module: 1 }).exec(); }
    async remove(id) {
        const item = await this.model.findByIdAndDelete(id).exec();
        if (!item)
            throw new common_1.NotFoundException(`Permission ${id} not found.`);
        return item;
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Permission')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map