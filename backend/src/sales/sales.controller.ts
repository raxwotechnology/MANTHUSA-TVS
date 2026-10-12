import { Controller, Get, Post, Body, Param, Put, Delete, Req } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Roles } from '../auth/roles.decorator';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles('Sales & Operations', 'Accountant / Finance Staff')
  create(@Body() createSaleDto: any, @Req() request: any) {
    return this.salesService.create({ ...createSaleDto, salesperson: request.user.sub });
  }

  @Get()
  @Roles('Sales & Operations', 'Accountant / Finance Staff', 'Customer')
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  @Roles('Sales & Operations', 'Accountant / Finance Staff', 'Customer')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Get(':id/contract')
  @Roles('Sales & Operations', 'Accountant / Finance Staff', 'Customer')
  getSalesContract(@Param('id') id: string) {
    return this.salesService.getSalesContract(id);
  }

  @Put(':id')
  @Roles('Sales & Operations', 'Accountant / Finance Staff')
  update(@Param('id') id: string, @Body() updateSaleDto: any) {
    return this.salesService.update(id, updateSaleDto);
  }

  @Delete(':id')
  @Roles('Sales & Operations', 'Accountant / Finance Staff')
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}
