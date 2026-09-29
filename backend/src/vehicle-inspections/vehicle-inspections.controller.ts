import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { VehicleInspectionsService } from './vehicle-inspections.service';
import { Roles } from '../auth/roles.decorator';

@Controller('vehicle-inspections')
@Roles('Sales & Operations')
export class VehicleInspectionsController {
  constructor(private readonly inspections: VehicleInspectionsService) {}
  @Post() create(@Body() body: any) { return this.inspections.create(body); }
  @Get() findAll() { return this.inspections.findAll(); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.inspections.update(id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.inspections.remove(id); }
}
