import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { DocumentSchema } from './schemas/document.schema';

@Module({ imports: [MongooseModule.forFeature([{ name: 'StoredDocument', schema: DocumentSchema }])], controllers: [DocumentsController], providers: [DocumentsService] })
export class DocumentsModule {}
