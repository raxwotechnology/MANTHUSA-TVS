import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Roles } from '../auth/roles.decorator';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Roles('Sales & Operations')
  create(@Body() createCustomerDto: any) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @Roles('Sales & Operations', 'Accountant / Finance Staff')
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @Roles('Sales & Operations', 'Accountant / Finance Staff')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Get(':id/timeline')
  @Roles('Sales & Operations', 'Accountant / Finance Staff')
  timeline(@Param('id') id: string) { return this.customersService.timeline(id); }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: any) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
