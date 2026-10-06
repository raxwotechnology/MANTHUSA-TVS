import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { Roles } from '../auth/roles.decorator';

@Controller('suppliers')
@Roles('Inventory Manager')
export class SuppliersController {
  constructor(private readonly suppliers: SuppliersService) {}
  @Post() create(@Body() body: any) { return this.suppliers.create(body); }
  @Get() findAll() { return this.suppliers.findAll(); }
  @Patch(':id') update(@Param('id') id: string, @Body() body: any) { return this.suppliers.update(id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.suppliers.remove(id); }
}
