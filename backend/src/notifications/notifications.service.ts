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

  async sendSms(_recipientPhone: string, _message: string) {
    throw new ServiceUnavailableException('SMS delivery is not configured. No message was sent.');
  }

  async sendWhatsApp(_recipientPhone: string, _message: string) {
    throw new ServiceUnavailableException('WhatsApp delivery is not configured. No message was sent.');
  }
}
