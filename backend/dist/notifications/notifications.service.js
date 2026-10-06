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
    async sendSms(recipientPhone, message, type = 'General') {
        const cleanPhone = String(recipientPhone || '').trim();
        const cleanMsg = String(message || '').trim();
        const smsApiKey = process.env.SMS_API_KEY || process.env.TWILIO_AUTH_TOKEN;
        const smsGatewayUrl = process.env.SMS_GATEWAY_URL || 'https://api.notify.lk/api/v2/send';
        let status = 'Sent (Mock Gateway)';
        let gatewayResponse = { success: true, timestamp: new Date() };
        if (smsApiKey && smsGatewayUrl) {
            try {
                const response = await fetch(smsGatewayUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${smsApiKey}` },
                    body: JSON.stringify({ recipient: cleanPhone, message: cleanMsg, sender_id: process.env.SMS_SENDER_ID || 'SalesPlus' })
                });
                gatewayResponse = await response.json().catch(() => ({ status: response.status }));
                status = response.ok ? 'Delivered' : 'Failed';
            }
            catch (err) {
                status = 'Gateway Error';
                gatewayResponse = { error: err.message };
            }
        }
        const notification = await new this.model({
            title: `SMS Sent (${type})`,
            message: `SMS to ${cleanPhone}: "${cleanMsg}" [Status: ${status}]`,
            type: 'SMS',
            isRead: true,
            meta: { phone: cleanPhone, smsContent: cleanMsg, gatewayResponse, status }
        }).save();
        return { success: true, status, recipient: cleanPhone, notificationId: notification._id, gatewayResponse };
    }
    async sendWhatsApp(recipientPhone, message) {
        return this.sendSms(recipientPhone, message, 'WhatsApp');
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Notification')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map