import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CommissionsService } from './commissions.service';
import { Roles } from '../auth/roles.decorator';

@Controller('commissions')
@Roles('Admin / Owner', 'Sales & Operations', 'Accountant / Finance Staff')
export class CommissionsController {
  constructor(private readonly commissions: CommissionsService) {}
  @Post() create(@Body() body: any) { return this.commissions.create(body); }
  @Get() findAll() { return this.commissions.findAll(); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.commissions.update(id, body); }
}
