import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
export declare class AuditLogInterceptor implements NestInterceptor {
    private readonly logs;
    constructor(logs: Model<any>);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
