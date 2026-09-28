import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { DiscountRequestsService } from './discount-requests.service';
import { Roles } from '../auth/roles.decorator';

@Controller('discount-requests')
@Roles('Sales & Operations')
export class DiscountRequestsController {
  constructor(private readonly requests: DiscountRequestsService) {}
  @Post() create(@Body() body: any, @Req() request: any) { return this.requests.create(body, request.user.sub); }
  @Get() findAll() { return this.requests.findAll(); }
  @Put(':id/decision') decide(@Param('id') id: string, @Body() body: any, @Req() request: any) { return this.requests.decide(id, body, request.user.sub, request.user.role); }
}
