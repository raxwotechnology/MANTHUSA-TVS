import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { TestDrivesService } from './test-drives.service';
import { Roles } from '../auth/roles.decorator';

@Controller('test-drives')
@Roles('Admin / Owner', 'Sales & Operations', 'Customer')
export class TestDrivesController {
  constructor(private readonly drives: TestDrivesService) {}

  @Post()
  @Roles('Admin / Owner', 'Sales & Operations')
  create(@Body() body: any) {
    return this.drives.create(body);
  }

  @Get('my')
  findMy(@Req() req: any) {
    const customerId = req.user?.customerId;
    if (!customerId) return [];
    return this.drives.findByCustomer(customerId);
  }

  @Get()
  @Roles('Admin / Owner', 'Sales & Operations')
  findAll() {
    return this.drives.findAll();
  }

  @Put(':id')
  @Roles('Admin / Owner', 'Sales & Operations')
  update(@Param('id') id: string, @Body() body: any) {
    return this.drives.update(id, body);
  }

  @Delete(':id')
  @Roles('Admin / Owner', 'Sales & Operations')
  remove(@Param('id') id: string) {
    return this.drives.remove(id);
  }
}
