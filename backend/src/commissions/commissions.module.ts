import { Module } from '@nestjs/common';
import { CommissionsController } from './commissions.controller';
import { CommissionsService } from './commissions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommissionSchema } from './schemas/commission.schema';
import { SaleSchema } from '../sales/schemas/sale.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Commission', schema: CommissionSchema },
    { name: 'Sale', schema: SaleSchema },
  ])],
  controllers: [CommissionsController],
  providers: [CommissionsService]
})
export class CommissionsModule {}
