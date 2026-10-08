import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getPublic(): Promise<Record<string, any>>;
    getAll(): Promise<Record<string, any>>;
    getByKey(key: string): Promise<any>;
    saveAll(body: Record<string, any>): Promise<Record<string, any>>;
    putAll(body: Record<string, any>): Promise<Record<string, any>>;
    updateKey(key: string, body: any): Promise<any>;
    resetDefaults(): Promise<Record<string, any>>;
}
