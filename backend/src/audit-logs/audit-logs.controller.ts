import { Controller, Get, Query } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { Roles } from '../auth/roles.decorator';

@Controller('audit-logs')
@Roles('Admin / Owner')
export class AuditLogsController {
  constructor(private readonly logs: AuditLogsService) {}
  @Get() findAll(@Query('limit') limit?: string) { return this.logs.findAll(Number(limit) || 100); }
}
