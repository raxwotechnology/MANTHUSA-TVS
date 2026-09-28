import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockMovementsService } from './stock-movements.service';
import { StockMovementsController } from './stock-movements.controller';
import { StockMovementSchema } from './schemas/stock-movement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'StockMovement', schema: StockMovementSchema }]),
  ],
  controllers: [StockMovementsController],
  providers: [StockMovementsService],
  exports: [StockMovementsService],
})
export class StockMovementsModule {}
