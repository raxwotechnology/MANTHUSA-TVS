import { Module } from '@nestjs/common';
import { VehiclePurchasesController } from './vehicle-purchases.controller';
import { VehiclePurchasesService } from './vehicle-purchases.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VehiclePurchaseSchema } from './schemas/vehicle-purchase.schema';
import { VehicleSchema } from '../vehicles/schemas/vehicle.schema';
import { SupplierSchema } from '../suppliers/schemas/supplier.schema';
import { CashTransactionSchema } from '../cash-transactions/schemas/cash-transaction.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'VehiclePurchase', schema: VehiclePurchaseSchema },
    { name: 'Vehicle', schema: VehicleSchema },
    { name: 'Supplier', schema: SupplierSchema },
    { name: 'CashTransaction', schema: CashTransactionSchema },
  ])],
  controllers: [VehiclePurchasesController],
  providers: [VehiclePurchasesService]
})
export class VehiclePurchasesModule {}
