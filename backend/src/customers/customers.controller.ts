import { Controller, Get, Post, Body, Param, Put, Delete, Req } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Roles } from '../auth/roles.decorator';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Roles('Sales & Operations')
  create(@Body() createCustomerDto: any) {
    return this.customersService.create(createCustomerDto);
  }

  @Get('me')
  @Roles('Customer', 'Sales & Operations', 'Admin / Owner')
  async getMyProfile(@Req() req: any) {
    const userId = req.user?.sub;
    const customer = await this.customersService.findByUserId(userId);
    if (!customer) {
      return { fullName: req.user?.name || '', email: req.user?.email || '', phone: '' };
    }
    return customer;
  }

  @Put('me')
  @Roles('Customer', 'Sales & Operations', 'Admin / Owner')
  async updateMyProfile(@Req() req: any, @Body() body: any) {
    const userId = req.user?.sub;
    // Disallow overriding critical permissions/identity
    const safePayload = {
      fullName: body.fullName,
      phone: body.phone,
      address: body.address,
      city: body.city,
      nicOrPassport: body.nicOrPassport,
      gender: body.gender,
      occupation: body.occupation,
      company: body.company,
    };
    return this.customersService.updateByUserId(userId, safePayload);
  }

  @Get()
  @Roles('Sales & Operations', 'Accountant / Finance Staff')
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @Roles('Sales & Operations', 'Accountant / Finance Staff')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Get(':id/timeline')
  @Roles('Sales & Operations', 'Accountant / Finance Staff')
  timeline(@Param('id') id: string) { return this.customersService.timeline(id); }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: any) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
