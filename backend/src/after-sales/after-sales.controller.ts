import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AfterSalesService } from './after-sales.service';
import { Roles } from '../auth/roles.decorator';

@Controller('after-sales')
@Roles('Sales & Operations')
export class AfterSalesController {
  constructor(private readonly afterSales: AfterSalesService) {}
  @Post() create(@Body() body: any) { return this.afterSales.create(body); }
  @Get() findAll() { return this.afterSales.findAll(); }
  @Get(':id/mta6') getMta6Form(@Param('id') id: string) { return this.afterSales.getMta6Form(id); }
  @Get(':id/mta8') getMta8Form(@Param('id') id: string) { return this.afterSales.getMta8Form(id); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.afterSales.update(id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.afterSales.remove(id); }
}
