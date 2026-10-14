import { Controller, Get, Param } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { Public } from '../auth/public.decorator';

@Controller('public/vehicles')
export class PublicVehiclesController {
  constructor(private readonly vehicles: VehiclesService) {}

  @Get()
  @Public()
  list() {
    return this.vehicles.findPublicListings();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.vehicles.findOnePublic(id);
  }
}

