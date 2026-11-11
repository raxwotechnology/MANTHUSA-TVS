import { Controller, Get, Post, Body, Param, Put, Delete, Req } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { Roles } from '../auth/roles.decorator';

@Controller('vehicles')
@Roles('Sales & Operations', 'Accountant / Finance Staff', 'Admin / Owner', 'Inventory Manager', 'Customer')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @Roles('Admin / Owner', 'Inventory Manager', 'Sales & Operations')
  create(@Body() createVehicleDto: any) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  async findAll(@Req() req: any) {
    const role = req.user?.role;
    const list = await this.vehiclesService.findAll();
    return list.map(v => this.vehiclesService.redactFinancials(v, role));
  }

  @Put('model-price')
  @Roles('Admin / Owner', 'Inventory Manager', 'Sales & Operations')
  updateModelPrice(@Body() updateModelPriceDto: any) {
    return this.vehiclesService.updateModelPrice(updateModelPriceDto);
  }

  @Get(':id/qr-code')
  getQrCode(@Param('id') id: string) {
    return this.vehiclesService.getQrCode(id);
  }

  @Get(':id/barcode')
  getBarcode(@Param('id') id: string) {
    return this.vehiclesService.getBarcode(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const role = req.user?.role;
    const vehicle = await this.vehiclesService.findOne(id);
    return this.vehiclesService.redactFinancials(vehicle, role);
  }

  @Put(':id')
  @Roles('Admin / Owner', 'Inventory Manager', 'Sales & Operations')
  update(@Param('id') id: string, @Body() updateVehicleDto: any) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @Roles('Admin / Owner', 'Inventory Manager')
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}
