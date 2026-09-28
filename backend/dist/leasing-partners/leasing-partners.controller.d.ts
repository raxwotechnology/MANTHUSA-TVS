import { LeasingPartnersService } from './leasing-partners.service';
export declare class LeasingPartnersController {
    private readonly leasingPartnersService;
    constructor(leasingPartnersService: LeasingPartnersService);
    create(dto: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/leasing-partner.schema").LeasingPartnerDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leasing-partner.schema").LeasingPartner & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/leasing-partner.schema").LeasingPartnerDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leasing-partner.schema").LeasingPartner & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    update(id: string, dto: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/leasing-partner.schema").LeasingPartnerDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leasing-partner.schema").LeasingPartner & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/leasing-partner.schema").LeasingPartnerDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leasing-partner.schema").LeasingPartner & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
