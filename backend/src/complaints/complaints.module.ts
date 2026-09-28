import { Module } from '@nestjs/common';
import { ComplaintsController } from './complaints.controller';
import { ComplaintsService } from './complaints.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ComplaintSchema } from './schemas/complaint.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Complaint', schema: ComplaintSchema }])],
  controllers: [ComplaintsController],
  providers: [ComplaintsService]
})
export class ComplaintsModule {}
