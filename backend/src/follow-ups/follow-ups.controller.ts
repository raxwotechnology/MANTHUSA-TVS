import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { FollowUpsService } from './follow-ups.service';
import { Roles } from '../auth/roles.decorator';

@Controller('follow-ups')
@Roles('Sales & Operations')
export class FollowUpsController {
  constructor(private readonly followUps: FollowUpsService) {}
  @Post() create(@Body() body: any) { return this.followUps.create(body); }
  @Get() findAll() { return this.followUps.findAll(); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.followUps.update(id, body); }
}
