import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@Roles('Admin / Owner')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto);
  }

  @Patch('profile/avatar')
  @Roles('Admin / Owner', 'Sales & Operations', 'Accountant / Finance Staff', 'Inventory Manager', 'Customer')
  updateOwnAvatar(@Req() req: any, @Body('avatar') avatar: string) {
    return this.usersService.updateAvatar(req.user.sub, avatar);
  }

  @Get()
  @Roles('Admin / Owner', 'Sales & Operations', 'Accountant / Finance Staff')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(id, updateUserDto);
  }

  @Put(':id')
  updatePut(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
