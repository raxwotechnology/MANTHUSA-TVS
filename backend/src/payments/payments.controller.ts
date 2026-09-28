import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Roles } from '../auth/roles.decorator';

@Controller('payments')
@Roles('Accountant / Finance Staff')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post()
  create(@Body() body: any) { return this.payments.create(body); }

  @Get()
  findAll() { return this.payments.findAll(); }
}
