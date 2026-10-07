import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TestDrivesService } from './test-drives.service';
import { Roles } from '../auth/roles.decorator';

@Controller('test-drives')
@Roles('Admin / Owner', 'Sales & Operations', 'Customer')
export class TestDrivesController {
  constructor(private readonly drives: TestDrivesService) {}
  @Post() create(@Body() body: any) { return this.drives.create(body); }
  @Get() findAll() { return this.drives.findAll(); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.drives.update(id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.drives.remove(id); }
}
