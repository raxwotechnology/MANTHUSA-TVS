import { Model } from 'mongoose';
import { SettingDocument } from './schemas/setting.schema';
export declare const DEFAULT_SETTINGS: Record<string, any>;
export declare class SettingsService {
    private readonly settingModel;
    private readonly logger;
    constructor(settingModel: Model<SettingDocument>);
    getAll(): Promise<Record<string, any>>;
    getPublicSettings(): Promise<Record<string, any>>;
    getByKey(key: string): Promise<any>;
    update(key: string, value: any): Promise<any>;
    updateMany(data: Record<string, any>): Promise<Record<string, any>>;
    resetToDefaults(): Promise<Record<string, any>>;
}
