import { Controller, Get, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Roles } from '../auth/roles.decorator';

@Controller('dashboard')
@Roles('Sales & Operations', 'Accountant / Finance Staff', 'Admin / Owner', 'Inventory Manager', 'Customer')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats(@Req() req: any) {
    const role = (req.user?.role || '').toLowerCase();
    if (role.includes('customer') || role.includes('client')) {
      const uid = req.user?.sub || req.user?.id || req.user?._id;
      return this.dashboardService.getCustomerStats(uid ? String(uid) : '', req.user?.email);
    }
    return this.dashboardService.getDashboardStats();
  }
}
