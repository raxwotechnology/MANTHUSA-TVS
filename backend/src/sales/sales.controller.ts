import { Controller, Get, Post, Body, Param, Put, Delete, Req } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Roles } from '../auth/roles.decorator';

@Controller('sales')
@Roles('Sales & Operations', 'Accountant / Finance Staff', 'Customer', 'Admin / Owner', 'Inventory Manager')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles('Sales & Operations', 'Accountant / Finance Staff', 'Admin / Owner')
  create(@Body() createSaleDto: any, @Req() request: any) {
    return this.salesService.create({ ...createSaleDto, salesperson: request.user?.sub });
  }

  @Get('my')
  findMySales(@Req() req: any) {
    const customerId = req.user?.customerId;
    if (!customerId) return [];
    return this.salesService.findByCustomer(customerId);
  }

  @Get()
  @Roles('Sales & Operations', 'Accountant / Finance Staff', 'Admin / Owner', 'Inventory Manager')
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
  @Roles('Sales & Operations', 'Accountant / Finance Staff', 'Admin / Owner')
  update(@Param('id') id: string, @Body() updateSaleDto: any) {
    return this.salesService.update(id, updateSaleDto);
  }

  @Delete(':id')
  @Roles('Sales & Operations', 'Accountant / Finance Staff', 'Admin / Owner')
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}
