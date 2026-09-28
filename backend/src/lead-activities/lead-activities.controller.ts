import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { LeadActivitiesService } from './lead-activities.service';
import { Roles } from '../auth/roles.decorator';

@Controller('lead-activities')
@Roles('Sales & Operations')
export class LeadActivitiesController {
  constructor(private readonly activities: LeadActivitiesService) {}
  @Post() create(@Body() body: any, @Req() req: any) { return this.activities.create({ ...body, performedBy: req.user.sub }); }
  @Get() findAll(@Query('lead') lead?: string) { return this.activities.findAll(lead); }
}
