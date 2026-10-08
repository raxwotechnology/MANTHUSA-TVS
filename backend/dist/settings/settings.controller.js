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
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const settings_service_1 = require("./settings.service");
const roles_decorator_1 = require("../auth/roles.decorator");
const public_decorator_1 = require("../auth/public.decorator");
let SettingsController = class SettingsController {
    settingsService;
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async getPublic() {
        return this.settingsService.getPublicSettings();
    }
    async getAll() {
        return this.settingsService.getAll();
    }
    async getByKey(key) {
        return this.settingsService.getByKey(key);
    }
    async saveAll(body) {
        return this.settingsService.updateMany(body);
    }
    async putAll(body) {
        return this.settingsService.updateMany(body);
    }
    async updateKey(key, body) {
        return this.settingsService.update(key, body);
    }
    async resetDefaults() {
        return this.settingsService.resetToDefaults();
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('public'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getPublic", null);
__decorate([
    (0, roles_decorator_1.Roles)('Admin / Owner', 'Sales & Operations', 'Accountant / Finance Staff'),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getAll", null);
__decorate([
    (0, roles_decorator_1.Roles)('Admin / Owner', 'Sales & Operations', 'Accountant / Finance Staff'),
    (0, common_1.Get)(':key'),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getByKey", null);
__decorate([
    (0, roles_decorator_1.Roles)('Admin / Owner'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "saveAll", null);
__decorate([
    (0, roles_decorator_1.Roles)('Admin / Owner'),
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "putAll", null);
__decorate([
    (0, roles_decorator_1.Roles)('Admin / Owner'),
    (0, common_1.Patch)(':key'),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateKey", null);
__decorate([
    (0, roles_decorator_1.Roles)('Admin / Owner'),
    (0, common_1.Post)('reset'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "resetDefaults", null);
exports.SettingsController = SettingsController = __decorate([
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map