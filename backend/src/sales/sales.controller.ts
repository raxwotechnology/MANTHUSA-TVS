import { Controller, Get, Post, Body, Param, Put, Delete, Req } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Roles } from '../auth/roles.decorator';

@Controller('sales')
@Roles('Sales & Operations', 'Accountant / Finance Staff')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: any, @Req() request: any) {
    return this.salesService.create({ ...createSaleDto, salesperson: request.user.sub });
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Get(':id/contract')
  getSalesContract(@Param('id') id: string) {
    return this.salesService.getSalesContract(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: any) {
    return this.salesService.update(id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}
