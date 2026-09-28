import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Roles } from '../auth/roles.decorator';

@Controller('notifications')
@Roles('Sales & Operations', 'Accountant / Finance Staff')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}
  @Get() findMine(@Req() req: any) { return this.notifications.findForUser(req.user.sub); }
  @Patch(':id/read') markRead(@Param('id') id: string, @Req() req: any) { return this.notifications.markRead(id, req.user.sub); }
  @Roles('Admin / Owner')
  @Post() create(@Body() body: any) { return this.notifications.create(body); }
}
