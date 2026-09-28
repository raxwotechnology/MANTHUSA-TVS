import { Body, Controller, Get, Post } from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { Roles } from '../auth/roles.decorator';

@Controller('refunds')
@Roles('Accountant / Finance Staff')
export class RefundsController {
  constructor(private readonly refunds: RefundsService) {}
  @Post() create(@Body() body: any) { return this.refunds.create(body); }
  @Get() findAll() { return this.refunds.findAll(); }
}
