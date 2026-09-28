import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InstallmentsService } from './installments.service';
import { Roles } from '../auth/roles.decorator';

@Controller('installments')
@Roles('Accountant / Finance Staff')
export class InstallmentsController {
  constructor(private readonly installments: InstallmentsService) {}
  @Post('agreements') createAgreement(@Body() body: any) { return this.installments.createAgreement(body); }
  @Get('agreements') listAgreements() { return this.installments.listAgreements(); }
  @Get('agreements/:id/schedule') getSchedule(@Param('id') id: string) { return this.installments.getSchedule(id); }
  @Patch(':id/paid') markPaid(@Param('id') id: string, @Body() body: any) { return this.installments.markPaid(id, body); }
}
