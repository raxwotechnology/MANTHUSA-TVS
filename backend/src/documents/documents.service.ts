import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { basename, join, resolve } from 'path';

const MAX_BYTES = 10 * 1024 * 1024;
const TYPES: Record<string, { mime: string; extension: string; signature: (buffer: Buffer) => boolean }> = {
  pdf: { mime: 'application/pdf', extension: '.pdf', signature: (b) => b.subarray(0, 5).toString() === '%PDF-' },
  jpeg: { mime: 'image/jpeg', extension: '.jpg', signature: (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  png: { mime: 'image/png', extension: '.png', signature: (b) => b.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) },
  webp: { mime: 'image/webp', extension: '.webp', signature: (b) => b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP' },
};

@Injectable()
export class DocumentsService {
  constructor(@InjectModel('StoredDocument') private readonly model: Model<any>) {}
  private directory() { return resolve(process.env.UPLOAD_DIR || join(process.cwd(), 'uploads')); }
  async create(file: { buffer: Buffer; size: number; mimetype: string; originalname: string }, input: any, userId?: string) {
    if (!file?.buffer || file.size > MAX_BYTES) throw new BadRequestException('A file up to 10 MB is required.');
    const type = Object.values(TYPES).find((candidate) => candidate.mime === file.mimetype && candidate.signature(file.buffer));
    if (!type) throw new BadRequestException('Only valid PDF, JPG, PNG and WEBP files are accepted.');
    if (!input.entityType || !input.entityId) throw new BadRequestException('Document entity type and entity ID are required.');
    const storageName = `${randomUUID()}${type.extension}`;
    await mkdir(this.directory(), { recursive: true });
    await writeFile(join(this.directory(), storageName), file.buffer, { flag: 'wx' });
    try {
      return await new this.model({ entityType: String(input.entityType).slice(0, 80), entityId: String(input.entityId).slice(0, 100), originalName: file.originalname.slice(0, 200), storageName, mimeType: type.mime, size: file.size, uploadedBy: userId }).save();
    } catch (error) {
      const { unlink } = await import('fs/promises');
      await unlink(join(this.directory(), storageName)).catch(() => undefined);
      throw error;
    }
  }
  list(entityType?: string, entityId?: string) {
    const filter: Record<string, string> = {};
    if (entityType) filter.entityType = entityType;
    if (entityId) filter.entityId = entityId;
    return this.model.find(filter).select('-storageName').sort({ createdAt: -1 }).exec();
  }
  async download(id: string) {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException('Document not found.');
    try {
      const safeName = basename(doc.storageName);
      return { doc, buffer: await readFile(join(this.directory(), safeName)) };
    } catch {
      throw new NotFoundException('Stored document file is missing.');
    }
  }
}
