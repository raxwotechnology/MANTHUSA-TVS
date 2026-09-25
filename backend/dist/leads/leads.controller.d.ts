import { LeadsService } from './leads.service';
export declare class LeadsController {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    create(createLeadDto: any): Promise<import("./schemas/lead.schema").LeadDocument>;
    findAll(): Promise<import("./schemas/lead.schema").LeadDocument[]>;
    findOne(id: string): Promise<import("./schemas/lead.schema").LeadDocument>;
    update(id: string, updateLeadDto: any): Promise<import("./schemas/lead.schema").LeadDocument>;
    remove(id: string): Promise<any>;
}
