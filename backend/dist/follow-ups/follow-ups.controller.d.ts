import { FollowUpsService } from './follow-ups.service';
export declare class FollowUpsController {
    private readonly followUps;
    constructor(followUps: FollowUpsService);
    create(body: any): any;
    findAll(): Promise<any[]>;
    update(id: string, body: any): Promise<any>;
}
