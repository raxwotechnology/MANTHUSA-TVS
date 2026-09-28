import { Module } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogsController } from './audit-logs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLogSchema } from './schemas/audit-log.schema';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditLogInterceptor } from './audit-log.interceptor';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'AuditLog', schema: AuditLogSchema }])],
  providers: [AuditLogsService, { provide: APP_INTERCEPTOR, useClass: AuditLogInterceptor }],
  controllers: [AuditLogsController]
})
export class AuditLogsModule {}
