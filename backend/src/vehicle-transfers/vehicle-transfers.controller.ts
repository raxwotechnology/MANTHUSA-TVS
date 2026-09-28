import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { VehicleTransfersService } from './vehicle-transfers.service';
import { Roles } from '../auth/roles.decorator';

@Controller('vehicle-transfers')
@Roles('Sales & Operations')
export class VehicleTransfersController {
  constructor(private readonly service: VehicleTransfersService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.service.create(createDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
