import type { Response } from 'express';
import { DocumentsService } from './documents.service';
export declare class DocumentsController {
    private readonly documents;
    constructor(documents: DocumentsService);
    create(file: any, req: any): Promise<any>;
    list(type?: string, id?: string): Promise<any[]>;
    download(id: string, response: Response): Promise<void>;
}
