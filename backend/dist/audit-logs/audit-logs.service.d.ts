import { Model } from 'mongoose';
export declare class AuditLogsService {
    private readonly logs;
    constructor(logs: Model<any>);
    findAll(limit?: number): Promise<any[]>;
}
