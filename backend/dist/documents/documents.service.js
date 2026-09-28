"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const crypto_1 = require("crypto");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const MAX_BYTES = 10 * 1024 * 1024;
const TYPES = {
    pdf: { mime: 'application/pdf', extension: '.pdf', signature: (b) => b.subarray(0, 5).toString() === '%PDF-' },
    jpeg: { mime: 'image/jpeg', extension: '.jpg', signature: (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
    png: { mime: 'image/png', extension: '.png', signature: (b) => b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) },
    webp: { mime: 'image/webp', extension: '.webp', signature: (b) => b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP' },
};
let DocumentsService = class DocumentsService {
    model;
    constructor(model) {
        this.model = model;
    }
    directory() { return (0, path_1.resolve)(process.env.UPLOAD_DIR || (0, path_1.join)(process.cwd(), 'uploads')); }
    async create(file, input, userId) {
        if (!file?.buffer || file.size > MAX_BYTES)
            throw new common_1.BadRequestException('A file up to 10 MB is required.');
        const type = Object.values(TYPES).find((candidate) => candidate.mime === file.mimetype && candidate.signature(file.buffer));
        if (!type)
            throw new common_1.BadRequestException('Only valid PDF, JPG, PNG and WEBP files are accepted.');
        if (!input.entityType || !input.entityId)
            throw new common_1.BadRequestException('Document entity type and entity ID are required.');
        const storageName = `${(0, crypto_1.randomUUID)()}${type.extension}`;
        await (0, promises_1.mkdir)(this.directory(), { recursive: true });
        await (0, promises_1.writeFile)((0, path_1.join)(this.directory(), storageName), file.buffer, { flag: 'wx' });
        try {
            return await new this.model({ entityType: String(input.entityType).slice(0, 80), entityId: String(input.entityId).slice(0, 100), originalName: file.originalname.slice(0, 200), storageName, mimeType: type.mime, size: file.size, uploadedBy: userId }).save();
        }
        catch (error) {
            const { unlink } = await import('fs/promises');
            await unlink((0, path_1.join)(this.directory(), storageName)).catch(() => undefined);
            throw error;
        }
    }
    list(entityType, entityId) {
        const filter = {};
        if (entityType)
            filter.entityType = entityType;
        if (entityId)
            filter.entityId = entityId;
        return this.model.find(filter).select('-storageName').sort({ createdAt: -1 }).exec();
    }
    async download(id) {
        const doc = await this.model.findById(id).exec();
        if (!doc)
            throw new common_1.NotFoundException('Document not found.');
        try {
            return { doc, buffer: await (0, promises_1.readFile)((0, path_1.join)(this.directory(), doc.storageName)) };
        }
        catch {
            throw new common_1.NotFoundException('Stored document file is missing.');
        }
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('StoredDocument')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map