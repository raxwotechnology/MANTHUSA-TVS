import { Controller, Get, Post, Body, Param, Put, Delete, Req, HttpException, HttpStatus } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';

@Controller('leads')
@Roles('Sales & Operations', 'Customer', 'Admin / Owner', 'Inventory Manager')
export class LeadsController {
  private readonly publicAttempts = new Map<string, number[]>();
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @Roles('Admin / Owner', 'Sales & Operations')
  create(@Body() createLeadDto: any) {
    return this.leadsService.create(createLeadDto);
  }

  @Post('public')
  @Public()
  createPublic(@Body() body: any, @Req() req: any) {
    const key = `${req.ip || 'unknown'}:${String(body.phone || '').slice(0, 40)}`;
    const now = Date.now();
    const recent = (this.publicAttempts.get(key) || []).filter((timestamp) => now - timestamp < 600_000);
    if (recent.length >= 10) throw new HttpException('Too many requests. Please try again later.', HttpStatus.TOO_MANY_REQUESTS);
    recent.push(now);
    this.publicAttempts.set(key, recent);
    return this.leadsService.createPublicInquiry(body);
  }

  @Get('my')
  async findMyLeads(@Req() req: any) {
    const customerId = req.user?.customerId;
    if (!customerId) return [];
    return this.leadsService.findByCustomer(customerId);
  }

  @Post(':id/convert-to-booking')
  @Roles('Admin / Owner', 'Sales & Operations')
  convertToBooking(@Param('id') id: string, @Req() req: any) {
    return this.leadsService.convertToBooking(id, req.user);
  }

  @Post(':id/convert-to-invoice')
  @Roles('Admin / Owner', 'Sales & Operations', 'Accountant / Finance Staff')
  convertToInvoice(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.leadsService.convertToInvoice(id, body, req.user);
  }

  @Post(':id/lost-sale')
  @Roles('Admin / Owner', 'Sales & Operations')
  markLostSale(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.leadsService.markLostSale(id, reason);
  }

  @Put(':id/status')
  @Roles('Admin / Owner', 'Sales & Operations')
  updateStatus(@Param('id') id: string, @Body('status') status: string, @Body('reason') reason?: string) {
    return this.leadsService.updateStatus(id, status, reason);
  }

  @Get()
  @Roles('Admin / Owner', 'Sales & Operations', 'Inventory Manager')
  findAll() {
    return this.leadsService.findAll();
  }

  @Get(':id')
  @Roles('Admin / Owner', 'Sales & Operations', 'Inventory Manager')
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Put(':id')
  @Roles('Admin / Owner', 'Sales & Operations')
  update(@Param('id') id: string, @Body() updateLeadDto: any) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @Delete(':id')
  @Roles('Admin / Owner', 'Sales & Operations')
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }
}
