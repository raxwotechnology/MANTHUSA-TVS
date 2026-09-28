import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { Roles } from '../auth/roles.decorator';

@Controller('permissions')
@Roles('Admin / Owner')
export class PermissionsController {
  constructor(private readonly permissions: PermissionsService) {}
  @Post() set(@Body() body: any) { return this.permissions.set(body); }
  @Get() findAll() { return this.permissions.findAll(); }
  @Delete(':id') remove(@Param('id') id: string) { return this.permissions.remove(id); }
}
