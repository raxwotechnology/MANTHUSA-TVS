import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { VehicleHandoversService } from './vehicle-handovers.service';
import { Roles } from '../auth/roles.decorator';

@Controller('vehicle-handovers')
@Roles('Sales & Operations')
export class VehicleHandoversController {
  constructor(private readonly handovers: VehicleHandoversService) {}
  @Post() create(@Body() body: any) { return this.handovers.create(body); }
  @Get() findAll() { return this.handovers.findAll(); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.handovers.update(id, body); }
}
