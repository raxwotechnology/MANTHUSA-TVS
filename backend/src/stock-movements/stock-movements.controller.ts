import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('stock-movements')
@UseGuards(JwtAuthGuard)
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Post()
  create(@Body() dto: any) {
    return this.stockMovementsService.create(dto);
  }

  @Get()
  findAll() {
    return this.stockMovementsService.findAll();
  }

  @Get('vehicle/:id')
  findByVehicle(@Param('id') vehicleId: string) {
    return this.stockMovementsService.findByVehicle(vehicleId);
  }
}
