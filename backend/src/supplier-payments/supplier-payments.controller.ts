import { Body, Controller, Get, Post } from '@nestjs/common';
import { SupplierPaymentsService } from './supplier-payments.service';
import { Roles } from '../auth/roles.decorator';

@Controller('supplier-payments')
@Roles('Accountant / Finance Staff')
export class SupplierPaymentsController {
  constructor(private readonly payments: SupplierPaymentsService) {}
  @Post() create(@Body() body: any) { return this.payments.create(body); }
  @Get() findAll() { return this.payments.findAll(); }
}
