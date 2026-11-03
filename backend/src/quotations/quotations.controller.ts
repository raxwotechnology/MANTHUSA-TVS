import { Controller, Get, Post, Body, Param, Put, Delete, Req } from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { Roles } from '../auth/roles.decorator';

@Controller('quotations')
@Roles('Sales & Operations', 'Customer', 'Admin / Owner', 'Accountant / Finance Staff')
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Post()
  @Roles('Admin / Owner', 'Sales & Operations')
  create(@Body() createQuotationDto: any) {
    return this.quotationsService.create(createQuotationDto);
  }

  @Get('my')
  findMyQuotations(@Req() req: any) {
    const customerId = req.user?.customerId;
    if (!customerId) return [];
    return this.quotationsService.findByCustomer(customerId);
  }

  @Put(':id/accept')
  acceptQuotation(@Param('id') id: string, @Req() req: any) {
    return this.quotationsService.acceptQuotation(id, req.user?.customerId);
  }

  @Put(':id/reject')
  rejectQuotation(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.quotationsService.rejectQuotation(id, body?.reason, req.user?.customerId);
  }

  @Post(':id/convert-to-invoice')
  @Roles('Admin / Owner', 'Sales & Operations', 'Accountant / Finance Staff')
  convertToInvoice(@Param('id') id: string, @Req() req: any) {
    return this.quotationsService.convertToInvoice(id, req.user);
  }

  @Get()
  @Roles('Admin / Owner', 'Sales & Operations', 'Accountant / Finance Staff')
  findAll() {
    return this.quotationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotationsService.findOne(id);
  }

  @Put(':id')
  @Roles('Admin / Owner', 'Sales & Operations')
  update(@Param('id') id: string, @Body() updateQuotationDto: any) {
    return this.quotationsService.update(id, updateQuotationDto);
  }

  @Delete(':id')
  @Roles('Admin / Owner')
  remove(@Param('id') id: string) {
    return this.quotationsService.remove(id);
  }
}
