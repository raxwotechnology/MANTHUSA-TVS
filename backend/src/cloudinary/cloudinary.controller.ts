import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { Public } from '../auth/public.decorator';

@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Public()
  @Get('status')
  getStatus() {
    return this.cloudinaryService.getStatus();
  }

  @Public()
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max for images & videos
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
    @Body('resourceType') resourceType?: 'auto' | 'image' | 'video' | 'raw',
    @Body('data') base64Data?: string,
  ) {
    if (file) {
      let deducedResourceType: 'auto' | 'image' | 'video' | 'raw' = resourceType || 'auto';
      if (!resourceType) {
        if (file.mimetype.startsWith('video/')) {
          deducedResourceType = 'video';
        } else if (file.mimetype.startsWith('image/')) {
          deducedResourceType = 'image';
        } else {
          deducedResourceType = 'auto';
        }
      }

      const result = await this.cloudinaryService.uploadBuffer(file.buffer, {
        folder: folder || 'manthusa-tvs',
        resource_type: deducedResourceType,
      });

      return {
        success: true,
        ...result,
      };
    }

    if (base64Data) {
      const result = await this.cloudinaryService.uploadBase64(base64Data, {
        folder: folder || 'manthusa-tvs',
        resource_type: resourceType || 'auto',
      });
      return {
        success: true,
        ...result,
      };
    }

    throw new BadRequestException('Please provide a file to upload or base64 data.');
  }

  @Public()
  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      limits: { fileSize: 100 * 1024 * 1024 },
    }),
  )
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folder') folder?: string,
    @Body('resourceType') resourceType?: 'auto' | 'image' | 'video' | 'raw',
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Please provide files to upload.');
    }

    const uploadPromises = files.map((file) => {
      let deducedResourceType: 'auto' | 'image' | 'video' | 'raw' = resourceType || 'auto';
      if (!resourceType) {
        if (file.mimetype.startsWith('video/')) {
          deducedResourceType = 'video';
        } else if (file.mimetype.startsWith('image/')) {
          deducedResourceType = 'image';
        } else {
          deducedResourceType = 'auto';
        }
      }

      return this.cloudinaryService.uploadBuffer(file.buffer, {
        folder: folder || 'manthusa-tvs',
        resource_type: deducedResourceType,
      });
    });

    const results = await Promise.all(uploadPromises);
    return {
      success: true,
      count: results.length,
      files: results,
    };
  }

  @Public()
  @Post('video')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 150 * 1024 * 1024 }, // 150 MB for video files
    }),
  )
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('Please select a video file.');
    }
    const result = await this.cloudinaryService.uploadBuffer(file.buffer, {
      folder: folder || 'manthusa-tvs/videos',
      resource_type: 'video',
    });

    return {
      success: true,
      ...result,
    };
  }

  @Public()
  @Delete(':publicId')
  async deleteAsset(
    @Param('publicId') publicId: string,
    @Query('resourceType') resourceType?: 'image' | 'video' | 'raw',
  ) {
    const result = await this.cloudinaryService.delete(publicId, resourceType || 'image');
    return { success: true, result };
  }
}
