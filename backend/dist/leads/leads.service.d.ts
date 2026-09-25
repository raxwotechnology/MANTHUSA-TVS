import { Model } from 'mongoose';
import { LeadDocument } from './schemas/lead.schema';
export declare class LeadsService {
    private leadModel;
    constructor(leadModel: Model<LeadDocument>);
    create(createLeadDto: any): Promise<LeadDocument>;
    findAll(): Promise<LeadDocument[]>;
    findOne(id: string): Promise<LeadDocument>;
    update(id: string, updateLeadDto: any): Promise<LeadDocument>;
    remove(id: string): Promise<any>;
}
