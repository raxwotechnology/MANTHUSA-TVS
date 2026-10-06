import { Controller, Get, Post, Body } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Roles } from '../auth/roles.decorator';

@Controller('roles')
@Roles('Admin / Owner')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: any) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }
}
