import { Module } from '@nestjs/common';
import { TestDrivesController } from './test-drives.controller';
import { TestDrivesService } from './test-drives.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TestDriveSchema } from './schemas/test-drive.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'TestDrive', schema: TestDriveSchema }])],
  controllers: [TestDrivesController],
  providers: [TestDrivesService]
})
export class TestDrivesModule {}
