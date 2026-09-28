import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeasingPartnersService } from './leasing-partners.service';
import { LeasingPartnersController } from './leasing-partners.controller';
import { LeasingPartnerSchema } from './schemas/leasing-partner.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'LeasingPartner', schema: LeasingPartnerSchema }]),
  ],
  controllers: [LeasingPartnersController],
  providers: [LeasingPartnersService],
  exports: [LeasingPartnersService],
})
export class LeasingPartnersModule {}
