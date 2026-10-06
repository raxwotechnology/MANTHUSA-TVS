import { Document, Types, Schema as MongooseSchema } from 'mongoose';
export type AfterSalesDocument = AfterSales & Document;
export declare class AfterSales {
    sale: Types.ObjectId;
    customer: Types.ObjectId;
    customerFeedback: string;
    reminders: {
        serviceReminder: Date;
        warrantyReminder: Date;
        insuranceRenewalReminder: Date;
        revenueLicenseReminder: Date;
    };
    warrantyInfo: {
        engineWarrantyMonths?: number;
        engineWarrantyMileageLimit?: number;
        engineWarrantyExpiryDate?: Date;
        gearboxWarrantyMonths?: number;
        gearboxWarrantyMileageLimit?: number;
        gearboxWarrantyExpiryDate?: Date;
        warrantyStatus?: string;
    };
    freeServices: Array<{
        serviceNumber: number;
        milestoneKm: number;
        dueDate?: Date;
        status: string;
        completedDate?: Date;
        notes?: string;
    }>;
    rmvTransfer: {
        transferorName?: string;
        transferorNic?: string;
        transferorAddress?: string;
        transfereeName?: string;
        transfereeNic?: string;
        transfereeAddress?: string;
        vehicleRegNo?: string;
        chassisNo?: string;
        engineNo?: string;
        mta6Status?: string;
        mta8Status?: string;
        rmvRefNumber?: string;
        submittedDate?: Date;
        completedDate?: Date;
        notes?: string;
    };
    nextFollowUp: Date;
}
export declare const AfterSalesSchema: MongooseSchema<AfterSales, import("mongoose").Model<AfterSales, any, any, any, any, any, AfterSales>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AfterSales, Document<unknown, {}, AfterSales, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<AfterSales & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    sale?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, AfterSales, Document<unknown, {}, AfterSales, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AfterSales & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customer?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, AfterSales, Document<unknown, {}, AfterSales, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AfterSales & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customerFeedback?: import("mongoose").SchemaDefinitionProperty<string, AfterSales, Document<unknown, {}, AfterSales, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AfterSales & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    reminders?: import("mongoose").SchemaDefinitionProperty<{
        serviceReminder: Date;
        warrantyReminder: Date;
        insuranceRenewalReminder: Date;
        revenueLicenseReminder: Date;
    }, AfterSales, Document<unknown, {}, AfterSales, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AfterSales & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    warrantyInfo?: import("mongoose").SchemaDefinitionProperty<{
        engineWarrantyMonths?: number;
        engineWarrantyMileageLimit?: number;
        engineWarrantyExpiryDate?: Date;
        gearboxWarrantyMonths?: number;
        gearboxWarrantyMileageLimit?: number;
        gearboxWarrantyExpiryDate?: Date;
        warrantyStatus?: string;
    }, AfterSales, Document<unknown, {}, AfterSales, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AfterSales & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    freeServices?: import("mongoose").SchemaDefinitionProperty<{
        serviceNumber: number;
        milestoneKm: number;
        dueDate?: Date;
        status: string;
        completedDate?: Date;
        notes?: string;
    }[], AfterSales, Document<unknown, {}, AfterSales, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AfterSales & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    rmvTransfer?: import("mongoose").SchemaDefinitionProperty<{
        transferorName?: string;
        transferorNic?: string;
        transferorAddress?: string;
        transfereeName?: string;
        transfereeNic?: string;
        transfereeAddress?: string;
        vehicleRegNo?: string;
        chassisNo?: string;
        engineNo?: string;
        mta6Status?: string;
        mta8Status?: string;
        rmvRefNumber?: string;
        submittedDate?: Date;
        completedDate?: Date;
        notes?: string;
    }, AfterSales, Document<unknown, {}, AfterSales, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AfterSales & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    nextFollowUp?: import("mongoose").SchemaDefinitionProperty<Date, AfterSales, Document<unknown, {}, AfterSales, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AfterSales & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, AfterSales>;
