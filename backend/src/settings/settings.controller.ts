import { Controller } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';

@Controller('settings')
@Roles('Admin / Owner')
export class SettingsController {}
