import { Model } from 'mongoose';
export declare class DocumentsService {
    private readonly model;
    constructor(model: Model<any>);
    private directory;
    create(file: {
        buffer: Buffer;
        size: number;
        mimetype: string;
        originalname: string;
    }, input: any, userId?: string): Promise<any>;
    list(entityType?: string, entityId?: string): Promise<any[]>;
    download(id: string): Promise<{
        doc: any;
        buffer: NonSharedBuffer;
    }>;
}
