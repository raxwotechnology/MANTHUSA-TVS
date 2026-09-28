import { Document, Types, Schema as MongooseSchema } from 'mongoose';
export type ExpenseDocument = Expense & Document;
export declare class Expense {
    expenseId: string;
    category: Types.ObjectId;
    amount: number;
    expenseDate: Date;
    description: string;
    vehicle: Types.ObjectId;
    supplier: Types.ObjectId;
    branch: Types.ObjectId;
    paymentMethod: string;
    receiptUrl: string;
    receiptNumber: string;
}
export declare const ExpenseSchema: MongooseSchema<Expense, import("mongoose").Model<Expense, any, any, any, any, any, Expense>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Expense, Document<unknown, {}, Expense, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Expense & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    expenseId?: import("mongoose").SchemaDefinitionProperty<string, Expense, Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Expense & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Expense, Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Expense & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, Expense, Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Expense & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    expenseDate?: import("mongoose").SchemaDefinitionProperty<Date, Expense, Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Expense & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Expense, Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Expense & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    vehicle?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Expense, Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Expense & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    supplier?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Expense, Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Expense & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    branch?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Expense, Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Expense & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paymentMethod?: import("mongoose").SchemaDefinitionProperty<string, Expense, Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Expense & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    receiptUrl?: import("mongoose").SchemaDefinitionProperty<string, Expense, Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Expense & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    receiptNumber?: import("mongoose").SchemaDefinitionProperty<string, Expense, Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Expense & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Expense>;
