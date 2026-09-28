import { Model } from 'mongoose';
import { LeasingPartnerDocument } from './schemas/leasing-partner.schema';
export declare class LeasingPartnersService {
    private leasingPartnerModel;
    constructor(leasingPartnerModel: Model<LeasingPartnerDocument>);
    create(dto: any): Promise<import("mongoose").Document<unknown, {}, LeasingPartnerDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leasing-partner.schema").LeasingPartner & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, LeasingPartnerDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leasing-partner.schema").LeasingPartner & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    update(id: string, dto: any): Promise<(import("mongoose").Document<unknown, {}, LeasingPartnerDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leasing-partner.schema").LeasingPartner & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, LeasingPartnerDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leasing-partner.schema").LeasingPartner & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
