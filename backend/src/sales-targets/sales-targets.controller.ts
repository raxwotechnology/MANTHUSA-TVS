import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { SalesTargetsService } from './sales-targets.service';
import { Roles } from '../auth/roles.decorator';

@Controller('sales-targets')
@Roles('Sales & Operations')
export class SalesTargetsController {
  constructor(private readonly targets: SalesTargetsService) {}
  @Post() create(@Body() body: any) { return this.targets.create(body); }
  @Get() findAll() { return this.targets.findAll(); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.targets.update(id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.targets.remove(id); }
}
