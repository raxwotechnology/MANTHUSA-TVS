import { Document } from 'mongoose';
export type ExpenseCategoryDocument = ExpenseCategory & Document;
export declare class ExpenseCategory {
    name: string;
    description: string;
}
export declare const ExpenseCategorySchema: import("mongoose").Schema<ExpenseCategory, import("mongoose").Model<ExpenseCategory, any, any, any, any, any, ExpenseCategory>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ExpenseCategory, Document<unknown, {}, ExpenseCategory, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ExpenseCategory & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    name?: import("mongoose").SchemaDefinitionProperty<string, ExpenseCategory, Document<unknown, {}, ExpenseCategory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ExpenseCategory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, ExpenseCategory, Document<unknown, {}, ExpenseCategory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ExpenseCategory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, ExpenseCategory>;
