import { Document, Types, Schema as MongooseSchema } from 'mongoose';
export type VehicleDocument = Vehicle & Document;
export declare class Vehicle {
    stockNumber: string;
    registrationNumber: string;
    make: string;
    model: string;
    variant: string;
    manufacturingYear: number;
    registeredYear: number;
    vehicleType: string;
    condition: string;
    fuelType: string;
    transmission: string;
    driveType: string;
    engineCapacity: string;
    engineNumber: string;
    chassisNumber: string;
    mileage: number;
    color: string;
    status: string;
    location: Types.ObjectId;
    branch: Types.ObjectId;
    year: number;
    purchasePrice: number;
    importCost: number;
    transportCost: number;
    repairCost: number;
    detailingCost: number;
    registrationCost: number;
    insuranceCost: number;
    advertisementCost: number;
    otherCosts: number;
    totalInvestment: number;
    sellingPrice: number;
    minimumSellingPrice: number;
    expectedProfit: number;
    actualProfit: number;
    horsepower: number;
    torque: string;
    seatingCapacity: number;
    doors: number;
    bodyType: string;
    dimensions: string;
    weight: string;
    fuelTankCapacity: string;
    safetyFeatures: string[];
    entertainmentFeatures: string[];
    comfortFeatures: string[];
    customSpecifications: Record<string, string>;
    images: string[];
    mediaAngles: {
        front?: string;
        rear?: string;
        left?: string;
        right?: string;
        interior?: string;
        dashboard?: string;
        engine?: string;
        wheels?: string;
        damage?: string[];
        documents?: string[];
        view360Url?: string;
        videoUrl?: string;
        youtubeUrl?: string;
    };
}
export declare const VehicleSchema: MongooseSchema<Vehicle, import("mongoose").Model<Vehicle, any, any, any, any, any, Vehicle>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Vehicle, Document<unknown, {}, Vehicle, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    stockNumber?: import("mongoose").SchemaDefinitionProperty<string, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    registrationNumber?: import("mongoose").SchemaDefinitionProperty<string, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    make?: import("mongoose").SchemaDefinitionProperty<string, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    model?: import("mongoose").SchemaDefinitionProperty<string, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    variant?: import("mongoose").SchemaDefinitionProperty<string, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    manufacturingYear?: import("mongoose").SchemaDefinitionProperty<number, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    registeredYear?: import("mongoose").SchemaDefinitionProperty<number, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    vehicleType?: import("mongoose").SchemaDefinitionProperty<string, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    condition?: import("mongoose").SchemaDefinitionProperty<string, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    fuelType?: import("mongoose").SchemaDefinitionProperty<string, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    transmission?: import("mongoose").SchemaDefinitionProperty<string, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    driveType?: import("mongoose").SchemaDefinitionProperty<string, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    engineCapacity?: import("mongoose").SchemaDefinitionProperty<string, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    engineNumber?: import("mongoose").SchemaDefinitionProperty<string, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    chassisNumber?: import("mongoose").SchemaDefinitionProperty<string, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    mileage?: import("mongoose").SchemaDefinitionProperty<number, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    color?: import("mongoose").SchemaDefinitionProperty<string, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    location?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    branch?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    year?: import("mongoose").SchemaDefinitionProperty<number, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    purchasePrice?: import("mongoose").SchemaDefinitionProperty<number, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    importCost?: import("mongoose").SchemaDefinitionProperty<number, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    transportCost?: import("mongoose").SchemaDefinitionProperty<number, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    repairCost?: import("mongoose").SchemaDefinitionProperty<number, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    detailingCost?: import("mongoose").SchemaDefinitionProperty<number, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    registrationCost?: import("mongoose").SchemaDefinitionProperty<number, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    insuranceCost?: import("mongoose").SchemaDefinitionProperty<number, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    advertisementCost?: import("mongoose").SchemaDefinitionProperty<number, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    otherCosts?: import("mongoose").SchemaDefinitionProperty<number, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    totalInvestment?: import("mongoose").SchemaDefinitionProperty<number, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sellingPrice?: import("mongoose").SchemaDefinitionProperty<number, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    minimumSellingPrice?: import("mongoose").SchemaDefinitionProperty<number, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    expectedProfit?: import("mongoose").SchemaDefinitionProperty<number, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    actualProfit?: import("mongoose").SchemaDefinitionProperty<number, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    horsepower?: import("mongoose").SchemaDefinitionProperty<number, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    torque?: import("mongoose").SchemaDefinitionProperty<string, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    seatingCapacity?: import("mongoose").SchemaDefinitionProperty<number, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    doors?: import("mongoose").SchemaDefinitionProperty<number, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    bodyType?: import("mongoose").SchemaDefinitionProperty<string, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    dimensions?: import("mongoose").SchemaDefinitionProperty<string, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    weight?: import("mongoose").SchemaDefinitionProperty<string, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    fuelTankCapacity?: import("mongoose").SchemaDefinitionProperty<string, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    safetyFeatures?: import("mongoose").SchemaDefinitionProperty<string[], Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    entertainmentFeatures?: import("mongoose").SchemaDefinitionProperty<string[], Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    comfortFeatures?: import("mongoose").SchemaDefinitionProperty<string[], Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customSpecifications?: import("mongoose").SchemaDefinitionProperty<Record<string, string>, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    images?: import("mongoose").SchemaDefinitionProperty<string[], Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    mediaAngles?: import("mongoose").SchemaDefinitionProperty<{
        front?: string;
        rear?: string;
        left?: string;
        right?: string;
        interior?: string;
        dashboard?: string;
        engine?: string;
        wheels?: string;
        damage?: string[];
        documents?: string[];
        view360Url?: string;
        videoUrl?: string;
        youtubeUrl?: string;
    }, Vehicle, Document<unknown, {}, Vehicle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Vehicle>;
