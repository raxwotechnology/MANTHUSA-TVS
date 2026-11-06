import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Roles } from '../auth/roles.decorator';

@Controller('reservations')
@Roles('Sales & Operations', 'Accountant / Finance Staff', 'Customer', 'Admin / Owner', 'Inventory Manager')
export class ReservationsController {
  constructor(private readonly reservations: ReservationsService) {}

  @Post()
  @Roles('Admin / Owner', 'Sales & Operations')
  create(@Body() body: any) {
    return this.reservations.create(body);
  }

  @Get('my')
  findMyReservations(@Req() req: any) {
    const customerId = req.user?.customerId;
    if (!customerId) return [];
    return this.reservations.findByCustomer(customerId);
  }

  @Get()
  @Roles('Admin / Owner', 'Sales & Operations', 'Accountant / Finance Staff', 'Inventory Manager')
  findAll() {
    return this.reservations.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.reservations.findOne(id, req.user);
  }

  @Put(':id')
  @Roles('Admin / Owner', 'Sales & Operations', 'Accountant / Finance Staff')
  update(@Param('id') id: string, @Body() body: any) {
    return this.reservations.update(id, body);
  }

  @Delete(':id')
  @Roles('Admin / Owner')
  remove(@Param('id') id: string) {
    return this.reservations.remove(id);
  }
}
