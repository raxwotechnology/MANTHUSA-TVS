import { Module } from '@nestjs/common';
import { SalesTargetsController } from './sales-targets.controller';
import { SalesTargetsService } from './sales-targets.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesTargetSchema } from './schemas/sales-target.schema';
import { SaleSchema } from '../sales/schemas/sale.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'SalesTarget', schema: SalesTargetSchema }, { name: 'Sale', schema: SaleSchema }])],
  controllers: [SalesTargetsController],
  providers: [SalesTargetsService]
})
export class SalesTargetsModule {}
