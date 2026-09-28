import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CashTransactionsService } from './cash-transactions.service';
import { Roles } from '../auth/roles.decorator';

@Controller('cash-transactions')
@Roles('Accountant / Finance Staff')
export class CashTransactionsController {
  constructor(private readonly cashTxService: CashTransactionsService) {}

  @Post()
  create(@Body() createTxDto: any) {
    return this.cashTxService.create(createTxDto);
  }

  @Get()
  findAll() {
    return this.cashTxService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cashTxService.findOne(id);
  }
}
