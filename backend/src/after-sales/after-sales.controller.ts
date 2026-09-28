import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AfterSalesService } from './after-sales.service';
import { Roles } from '../auth/roles.decorator';

@Controller('after-sales')
@Roles('Sales & Operations')
export class AfterSalesController {
  constructor(private readonly afterSales: AfterSalesService) {}
  @Post() create(@Body() body: any) { return this.afterSales.create(body); }
  @Get() findAll() { return this.afterSales.findAll(); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.afterSales.update(id, body); }
}
