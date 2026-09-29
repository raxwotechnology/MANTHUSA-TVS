import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { Roles } from '../auth/roles.decorator';

@Controller('complaints')
@Roles('Sales & Operations')
export class ComplaintsController {
  constructor(private readonly complaints: ComplaintsService) {}
  @Post() create(@Body() body: any) { return this.complaints.create(body); }
  @Get() findAll() { return this.complaints.findAll(); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.complaints.update(id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.complaints.remove(id); }
}
