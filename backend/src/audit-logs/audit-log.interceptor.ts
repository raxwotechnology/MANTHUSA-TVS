import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(@InjectModel('AuditLog') private readonly logs: Model<any>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) || request.path?.startsWith('/audit-logs')) return next.handle();
    const controller = context.getClass().name.replace(/Controller$/, '').replace(/[A-Z]/g, (letter, index) => `${index ? '-' : ''}${letter.toLowerCase()}`);
    const body = { ...(request.body || {}) };
    for (const key of Object.keys(body)) if (/password|token|secret/i.test(key)) delete body[key];
    const action = `${method}_${controller.toUpperCase().replace(/-/g, '_')}`;
    return next.handle().pipe(tap(() => {
      void this.logs.create({
        user: request.user?.sub,
        action,
        entity: controller,
        entityId: request.params?.id,
        newValue: method === 'DELETE' ? undefined : body,
        ipAddress: request.ip,
      }).catch(() => undefined);
    }));
  }
}
