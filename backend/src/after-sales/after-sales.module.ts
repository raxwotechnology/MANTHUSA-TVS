import { Module } from '@nestjs/common';
import { AfterSalesController } from './after-sales.controller';
import { AfterSalesService } from './after-sales.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AfterSalesSchema } from './schemas/after-sales.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'AfterSales', schema: AfterSalesSchema }])],
  controllers: [AfterSalesController],
  providers: [AfterSalesService]
})
export class AfterSalesModule {}
