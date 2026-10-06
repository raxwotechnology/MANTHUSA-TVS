import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { LeasingPartnersService } from './leasing-partners.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('leasing-partners')
@UseGuards(JwtAuthGuard)
@Roles('Accountant / Finance Staff')
export class LeasingPartnersController {
  constructor(private readonly leasingPartnersService: LeasingPartnersService) {}

  @Post()
  create(@Body() dto: any) {
    return this.leasingPartnersService.create(dto);
  }

  @Get()
  findAll() {
    return this.leasingPartnersService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.leasingPartnersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leasingPartnersService.remove(id);
  }
}
