import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BranchSchema } from './schemas/branch.schema';
import { BranchesController } from './branches.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Branch', schema: BranchSchema }])],
  providers: [BranchesService],
  controllers: [BranchesController]
})
export class BranchesModule {}
