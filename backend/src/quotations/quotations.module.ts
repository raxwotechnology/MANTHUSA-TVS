import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuotationsController } from './quotations.controller';
import { QuotationsService } from './quotations.service';
import { QuotationSchema } from './schemas/quotation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Quotation', schema: QuotationSchema }])
  ],
  controllers: [QuotationsController],
  providers: [QuotationsService]
})
export class QuotationsModule {}
