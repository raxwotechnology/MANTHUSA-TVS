import { AuditLogsService } from './audit-logs.service';
export declare class AuditLogsController {
    private readonly logs;
    constructor(logs: AuditLogsService);
    findAll(limit?: string): Promise<any[]>;
}
