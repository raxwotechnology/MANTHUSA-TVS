import { LeadActivitiesService } from './lead-activities.service';
export declare class LeadActivitiesController {
    private readonly activities;
    constructor(activities: LeadActivitiesService);
    create(body: any, req: any): any;
    findAll(lead?: string): Promise<any[]>;
}
