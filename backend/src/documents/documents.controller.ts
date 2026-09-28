import { BadRequestException, Controller, Get, Param, Post, Query, Req, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { DocumentsService } from './documents.service';
import { Roles } from '../auth/roles.decorator';

@Controller('documents')
@Roles('Sales & Operations', 'Accountant / Finance Staff')
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  create(@UploadedFile() file: any, @Req() req: any) {
    if (!file) throw new BadRequestException('Select a document to upload.');
    return this.documents.create(file, req.body, req.user.sub);
  }
  @Get() list(@Query('entityType') type?: string, @Query('entityId') id?: string) { return this.documents.list(type, id); }
  @Get(':id/download') async download(@Param('id') id: string, @Res() response: Response) {
    const { doc, buffer } = await this.documents.download(id);
    response.setHeader('Content-Type', doc.mimeType);
    response.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(doc.originalName)}"`);
    response.setHeader('Content-Length', buffer.length);
    response.send(buffer);
  }
}
