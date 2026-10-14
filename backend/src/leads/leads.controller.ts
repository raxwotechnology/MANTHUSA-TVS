import { Controller, Get, Post, Body, Param, Put, Delete, Req, HttpException, HttpStatus } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';

@Controller('leads')
@Roles('Sales & Operations', 'Customer')
export class LeadsController {
  private readonly publicAttempts = new Map<string, number[]>();
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(@Body() createLeadDto: any) {
    return this.leadsService.create(createLeadDto);
  }

  @Post('public')
  @Public()
  createPublic(@Body() body: any, @Req() req: any) {
    const key = `${req.ip || 'unknown'}:${String(body.phone || '').slice(0, 40)}`;
    const now = Date.now();
    const recent = (this.publicAttempts.get(key) || []).filter((timestamp) => now - timestamp < 600_000);
    if (recent.length >= 3) throw new HttpException('Too many website enquiries from this phone. Please try again later.', HttpStatus.TOO_MANY_REQUESTS);
    recent.push(now); this.publicAttempts.set(key, recent);
    return this.leadsService.createPublicInquiry(body);
  }

  @Get('my')
  async findMyLeads(@Req() req: any) {
    const customerId = req.user?.customerId;
    if (!customerId) return [];
    return this.leadsService.findByCustomer(customerId);
  }

  @Get()
  @Roles('Admin / Owner', 'Sales & Operations')
  findAll() {
    return this.leadsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateLeadDto: any) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }
}
