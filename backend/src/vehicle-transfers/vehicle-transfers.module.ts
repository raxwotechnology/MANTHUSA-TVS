import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleTransfersService } from './vehicle-transfers.service';
import { VehicleTransfersController } from './vehicle-transfers.controller';
import { VehicleTransferSchema } from './schemas/vehicle-transfer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'VehicleTransfer', schema: VehicleTransferSchema }]),
  ],
  providers: [VehicleTransfersService],
  controllers: [VehicleTransfersController],
  exports: [VehicleTransfersService],
})
export class VehicleTransfersModule {}
