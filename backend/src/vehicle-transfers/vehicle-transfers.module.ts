import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleTransfersService } from './vehicle-transfers.service';
import { VehicleTransfersController } from './vehicle-transfers.controller';
import { VehicleTransferSchema } from './schemas/vehicle-transfer.schema';
import { VehicleSchema } from '../vehicles/schemas/vehicle.schema';
import { BranchSchema } from '../branches/schemas/branch.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'VehicleTransfer', schema: VehicleTransferSchema },
      { name: 'Vehicle', schema: VehicleSchema },
      { name: 'Branch', schema: BranchSchema },
    ]),
  ],
  providers: [VehicleTransfersService],
  controllers: [VehicleTransfersController],
  exports: [VehicleTransfersService],
})
export class VehicleTransfersModule {}
