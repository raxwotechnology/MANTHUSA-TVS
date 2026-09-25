import { QuotationsService } from './quotations.service';
export declare class QuotationsController {
    private readonly quotationsService;
    constructor(quotationsService: QuotationsService);
    create(createQuotationDto: any): Promise<import("./schemas/quotation.schema").QuotationDocument>;
    findAll(): Promise<import("./schemas/quotation.schema").QuotationDocument[]>;
    findOne(id: string): Promise<import("./schemas/quotation.schema").QuotationDocument>;
    update(id: string, updateQuotationDto: any): Promise<import("./schemas/quotation.schema").QuotationDocument>;
    remove(id: string): Promise<any>;
}
