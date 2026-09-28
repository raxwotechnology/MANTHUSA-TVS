import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CustomerSchema } from './schemas/customer.schema';
import { LeadSchema } from '../leads/schemas/lead.schema';
import { FollowUpSchema } from '../follow-ups/schemas/follow-up.schema';
import { TestDriveSchema } from '../test-drives/schemas/test-drive.schema';
import { QuotationSchema } from '../quotations/schemas/quotation.schema';
import { ReservationSchema } from '../reservations/schemas/reservation.schema';
import { PaymentSchema } from '../payments/schemas/payment.schema';
import { SaleSchema } from '../sales/schemas/sale.schema';
import { VehicleHandoverSchema } from '../vehicle-handovers/schemas/vehicle-handover.schema';
import { ComplaintSchema } from '../complaints/schemas/complaint.schema';
import { AfterSalesSchema } from '../after-sales/schemas/after-sales.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Customer', schema: CustomerSchema }, { name: 'Lead', schema: LeadSchema },
      { name: 'FollowUp', schema: FollowUpSchema }, { name: 'TestDrive', schema: TestDriveSchema },
      { name: 'Quotation', schema: QuotationSchema }, { name: 'Reservation', schema: ReservationSchema },
      { name: 'Payment', schema: PaymentSchema }, { name: 'Sale', schema: SaleSchema },
      { name: 'VehicleHandover', schema: VehicleHandoverSchema }, { name: 'Complaint', schema: ComplaintSchema },
      { name: 'AfterSales', schema: AfterSalesSchema },
    ])
  ],
  controllers: [CustomersController],
  providers: [CustomersService]
})
export class CustomersModule {}
