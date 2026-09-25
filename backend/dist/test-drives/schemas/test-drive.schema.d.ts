import { Document, Types } from 'mongoose';
export type TestDriveDocument = TestDrive & Document;
export declare class TestDrive {
    customer: Types.ObjectId;
    vehicle: Types.ObjectId;
    salesperson: Types.ObjectId;
    date: Date;
    startTime: string;
    endTime: string;
    drivingLicenseNo: string;
    status: string;
    feedback: string;
}
export declare const TestDriveSchema: import("mongoose").Schema<TestDrive, import("mongoose").Model<TestDrive, any, any, any, any, any, TestDrive>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TestDrive, Document<unknown, {}, TestDrive, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<TestDrive & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    customer?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, TestDrive, Document<unknown, {}, TestDrive, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TestDrive & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    vehicle?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, TestDrive, Document<unknown, {}, TestDrive, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TestDrive & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    salesperson?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, TestDrive, Document<unknown, {}, TestDrive, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TestDrive & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    date?: import("mongoose").SchemaDefinitionProperty<Date, TestDrive, Document<unknown, {}, TestDrive, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TestDrive & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    startTime?: import("mongoose").SchemaDefinitionProperty<string, TestDrive, Document<unknown, {}, TestDrive, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TestDrive & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    endTime?: import("mongoose").SchemaDefinitionProperty<string, TestDrive, Document<unknown, {}, TestDrive, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TestDrive & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    drivingLicenseNo?: import("mongoose").SchemaDefinitionProperty<string, TestDrive, Document<unknown, {}, TestDrive, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TestDrive & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, TestDrive, Document<unknown, {}, TestDrive, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TestDrive & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    feedback?: import("mongoose").SchemaDefinitionProperty<string, TestDrive, Document<unknown, {}, TestDrive, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TestDrive & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, TestDrive>;
