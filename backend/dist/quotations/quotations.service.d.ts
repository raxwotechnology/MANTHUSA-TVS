import { Model } from 'mongoose';
import { QuotationDocument } from './schemas/quotation.schema';
export declare class QuotationsService {
    private quotationModel;
    constructor(quotationModel: Model<QuotationDocument>);
    create(createQuotationDto: any): Promise<QuotationDocument>;
    findAll(): Promise<QuotationDocument[]>;
    findOne(id: string): Promise<QuotationDocument>;
    update(id: string, updateQuotationDto: any): Promise<QuotationDocument>;
    remove(id: string): Promise<any>;
}
