import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { VehiclePurchasesService } from './vehicle-purchases.service';
import { Roles } from '../auth/roles.decorator';

@Controller('vehicle-purchases')
@Roles('Sales & Operations', 'Accountant / Finance Staff')
export class VehiclePurchasesController {
  constructor(private readonly purchases: VehiclePurchasesService) {}

  @Post()
  create(@Body() body: any) { return this.purchases.create(body); }

  @Get()
  findAll() { return this.purchases.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.purchases.findOne(id); }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.purchases.update(id, body); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.purchases.remove(id); }
}
