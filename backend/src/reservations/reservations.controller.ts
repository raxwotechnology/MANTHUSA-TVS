import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Roles } from '../auth/roles.decorator';

@Controller('reservations')
@Roles('Sales & Operations', 'Accountant / Finance Staff')
export class ReservationsController {
  constructor(private readonly reservations: ReservationsService) {}

  @Post()
  create(@Body() body: any) { return this.reservations.create(body); }

  @Get()
  findAll() { return this.reservations.findAll(); }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.reservations.update(id, body); }
}
