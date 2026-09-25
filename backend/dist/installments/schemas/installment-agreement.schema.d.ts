import { Document, Types } from 'mongoose';
export type InstallmentAgreementDocument = InstallmentAgreement & Document;
export declare class InstallmentAgreement {
    sale: Types.ObjectId;
    customer: Types.ObjectId;
    financeCompany: string;
    loanAmount: number;
    downPayment: number;
    interestRate: number;
    loanPeriodMonths: number;
    monthlyInstallment: number;
    startDate: Date;
    endDate: Date;
}
export declare const InstallmentAgreementSchema: import("mongoose").Schema<InstallmentAgreement, import("mongoose").Model<InstallmentAgreement, any, any, any, any, any, InstallmentAgreement>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, InstallmentAgreement, Document<unknown, {}, InstallmentAgreement, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<InstallmentAgreement & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    sale?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, InstallmentAgreement, Document<unknown, {}, InstallmentAgreement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InstallmentAgreement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customer?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, InstallmentAgreement, Document<unknown, {}, InstallmentAgreement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InstallmentAgreement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    financeCompany?: import("mongoose").SchemaDefinitionProperty<string, InstallmentAgreement, Document<unknown, {}, InstallmentAgreement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InstallmentAgreement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    loanAmount?: import("mongoose").SchemaDefinitionProperty<number, InstallmentAgreement, Document<unknown, {}, InstallmentAgreement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InstallmentAgreement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    downPayment?: import("mongoose").SchemaDefinitionProperty<number, InstallmentAgreement, Document<unknown, {}, InstallmentAgreement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InstallmentAgreement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    interestRate?: import("mongoose").SchemaDefinitionProperty<number, InstallmentAgreement, Document<unknown, {}, InstallmentAgreement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InstallmentAgreement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    loanPeriodMonths?: import("mongoose").SchemaDefinitionProperty<number, InstallmentAgreement, Document<unknown, {}, InstallmentAgreement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InstallmentAgreement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    monthlyInstallment?: import("mongoose").SchemaDefinitionProperty<number, InstallmentAgreement, Document<unknown, {}, InstallmentAgreement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InstallmentAgreement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    startDate?: import("mongoose").SchemaDefinitionProperty<Date, InstallmentAgreement, Document<unknown, {}, InstallmentAgreement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InstallmentAgreement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    endDate?: import("mongoose").SchemaDefinitionProperty<Date, InstallmentAgreement, Document<unknown, {}, InstallmentAgreement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InstallmentAgreement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, InstallmentAgreement>;
