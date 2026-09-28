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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let NotificationsService = class NotificationsService {
    model;
    constructor(model) {
        this.model = model;
    }
    create(input) {
        return new this.model(input).save();
    }
    findForUser(userId) {
        return this.model.find({ $or: [{ recipient: userId }, { recipient: null }] }).sort({ createdAt: -1 }).limit(100).exec();
    }
    async markRead(id, userId) {
        const item = await this.model.findOneAndUpdate({ _id: id, $or: [{ recipient: userId }, { recipient: null }] }, { isRead: true }, { new: true }).exec();
        if (!item)
            throw new common_1.NotFoundException('Notification not found.');
        return item;
    }
    async sendSms(_recipientPhone, _message) {
        throw new common_1.ServiceUnavailableException('SMS delivery is not configured. No message was sent.');
    }
    async sendWhatsApp(_recipientPhone, _message) {
        throw new common_1.ServiceUnavailableException('WhatsApp delivery is not configured. No message was sent.');
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Notification')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map