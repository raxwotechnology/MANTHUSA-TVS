import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { VehicleValuationsService } from './vehicle-valuations.service';

@Controller('vehicle-valuations')
export class VehicleValuationsController {
  constructor(private readonly service: VehicleValuationsService) {}

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
