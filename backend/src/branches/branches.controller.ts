import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';

@Controller('branches')
export class BranchesController {
  constructor(private readonly branches: BranchesService) {}

  @Public()
  @Get('public')
  findPublic() {
    return this.branches.findAll();
  }

  @Roles('Admin / Owner')
  @Post()
  create(@Body() body: any) {
    return this.branches.create(body);
  }

  @Roles('Admin / Owner', 'Sales & Operations', 'Accountant / Finance Staff')
  @Get()
  findAll() {
    return this.branches.findAll();
  }

  @Roles('Admin / Owner')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.branches.update(id, body);
  }

  @Roles('Admin / Owner')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.branches.remove(id);
  }
}
