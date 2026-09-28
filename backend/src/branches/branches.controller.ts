import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { Roles } from '../auth/roles.decorator';

@Controller('branches')
@Roles('Admin / Owner')
export class BranchesController {
  constructor(private readonly branches: BranchesService) {}
  @Post() create(@Body() body: any) { return this.branches.create(body); }
  @Roles('Sales & Operations', 'Accountant / Finance Staff')
  @Get() findAll() { return this.branches.findAll(); }
  @Patch(':id') update(@Param('id') id: string, @Body() body: any) { return this.branches.update(id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.branches.remove(id); }
}
