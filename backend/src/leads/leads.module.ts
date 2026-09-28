import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { LeadSchema } from './schemas/lead.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { CustomerSchema } from '../customers/schemas/customer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Lead', schema: LeadSchema }, { name: 'Customer', schema: CustomerSchema }]), NotificationsModule
  ],
  controllers: [LeadsController],
  providers: [LeadsService]
})
export class LeadsModule {}
