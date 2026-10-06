import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NotificationsService {
  constructor(@InjectModel('Notification') private readonly model: Model<any>) {}

  create(input: any) {
    return new this.model(input).save();
  }

  findForUser(userId: string) {
    return this.model.find({ $or: [{ recipient: userId }, { recipient: null }] }).sort({ createdAt: -1 }).limit(100).exec();
  }

  async markRead(id: string, userId: string) {
    const item = await this.model.findOneAndUpdate({ _id: id, $or: [{ recipient: userId }, { recipient: null }] }, { isRead: true }, { new: true }).exec();
    if (!item) throw new NotFoundException('Notification not found.');
    return item;
  }

  async sendSms(recipientPhone: string, message: string, type: string = 'General') {
    const cleanPhone = String(recipientPhone || '').trim();
    const cleanMsg = String(message || '').trim();
    const smsApiKey = process.env.SMS_API_KEY || process.env.TWILIO_AUTH_TOKEN;
    const smsGatewayUrl = process.env.SMS_GATEWAY_URL || 'https://api.notify.lk/api/v2/send';

    let status = 'Sent (Mock Gateway)';
    let gatewayResponse: any = { success: true, timestamp: new Date() };

    if (smsApiKey && smsGatewayUrl) {
      try {
        const response = await fetch(smsGatewayUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${smsApiKey}` },
          body: JSON.stringify({ recipient: cleanPhone, message: cleanMsg, sender_id: process.env.SMS_SENDER_ID || 'SalesPlus' })
        });
        gatewayResponse = await response.json().catch(() => ({ status: response.status }));
        status = response.ok ? 'Delivered' : 'Failed';
      } catch (err: any) {
        status = 'Gateway Error';
        gatewayResponse = { error: err.message };
      }
    }

    // Record notification log
    const notification = await new this.model({
      title: `SMS Sent (${type})`,
      message: `SMS to ${cleanPhone}: "${cleanMsg}" [Status: ${status}]`,
      type: 'SMS',
      isRead: true,
      meta: { phone: cleanPhone, smsContent: cleanMsg, gatewayResponse, status }
    }).save();

    return { success: true, status, recipient: cleanPhone, notificationId: notification._id, gatewayResponse };
  }

  async sendWhatsApp(recipientPhone: string, message: string) {
    return this.sendSms(recipientPhone, message, 'WhatsApp');
  }
}
