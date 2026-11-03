import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Roles } from '../auth/roles.decorator';

@Controller('payments')
@Roles('Accountant / Finance Staff', 'Admin / Owner', 'Sales & Operations', 'Customer')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post()
  @Roles('Accountant / Finance Staff', 'Admin / Owner', 'Sales & Operations')
  create(@Body() body: any) {
    return this.payments.create(body);
  }

  @Get('my')
  findMyPayments(@Req() req: any) {
    const customerId = req.user?.customerId;
    if (!customerId) return [];
    return this.payments.findByCustomer(customerId);
  }

  @Get()
  @Roles('Accountant / Finance Staff', 'Admin / Owner', 'Sales & Operations')
  findAll() {
    return this.payments.findAll();
  }
}
