import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Roles } from '../auth/roles.decorator';

@Controller('notifications')
@Roles('Sales & Operations', 'Accountant / Finance Staff')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}
  @Get() findMine(@Req() req: any) { return this.notifications.findForUser(req.user.sub); }
  @Patch(':id/read') markRead(@Param('id') id: string, @Req() req: any) { return this.notifications.markRead(id, req.user.sub); }
  @Roles('Admin / Owner', 'Sales & Operations', 'Accountant / Finance Staff')
  @Post('send-sms')
  sendSms(@Body() body: { phone: string; message: string }) {
    return this.notifications.sendSms(body.phone, body.message);
  }

  @Roles('Admin / Owner', 'Sales & Operations', 'Accountant / Finance Staff')
  @Post('send-whatsapp')
  sendWhatsApp(@Body() body: { phone: string; message: string }) {
    return this.notifications.sendWhatsApp(body.phone, body.message);
  }
}
