import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionSchema } from './schemas/permission.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Permission', schema: PermissionSchema }])],
  providers: [PermissionsService],
  controllers: [PermissionsController]
})
export class PermissionsModule {}
