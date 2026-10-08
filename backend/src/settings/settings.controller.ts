import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Public()
  @Get('public')
  async getPublic() {
    return this.settingsService.getPublicSettings();
  }

  @Roles('Admin / Owner', 'Sales & Operations', 'Accountant / Finance Staff')
  @Get()
  async getAll() {
    return this.settingsService.getAll();
  }

  @Roles('Admin / Owner', 'Sales & Operations', 'Accountant / Finance Staff')
  @Get(':key')
  async getByKey(@Param('key') key: string) {
    return this.settingsService.getByKey(key);
  }

  @Roles('Admin / Owner')
  @Post()
  async saveAll(@Body() body: Record<string, any>) {
    return this.settingsService.updateMany(body);
  }

  @Roles('Admin / Owner')
  @Put()
  async putAll(@Body() body: Record<string, any>) {
    return this.settingsService.updateMany(body);
  }

  @Roles('Admin / Owner')
  @Patch(':key')
  async updateKey(@Param('key') key: string, @Body() body: any) {
    return this.settingsService.update(key, body);
  }

  @Roles('Admin / Owner')
  @Post('reset')
  async resetDefaults() {
    return this.settingsService.resetToDefaults();
  }
}
