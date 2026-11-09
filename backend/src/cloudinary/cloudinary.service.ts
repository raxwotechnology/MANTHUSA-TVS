import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  format?: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
}

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private configured = false;
  private configErrorMessage: string | null = null;

  constructor(private readonly configService: ConfigService) {
    this.initCloudinary();
  }

  private initCloudinary() {
    let cloudName =
      (this.configService.get<string>('CLOUDINARY_CLOUD_NAME') ||
        process.env.CLOUDINARY_CLOUD_NAME ||
        '').trim();
    let apiKey =
      (this.configService.get<string>('CLOUDINARY_API_KEY') ||
        process.env.CLOUDINARY_API_KEY ||
        '').trim();
    let apiSecret =
      (this.configService.get<string>('CLOUDINARY_API_SECRET') ||
        process.env.CLOUDINARY_API_SECRET ||
        '').trim();
    let cloudinaryUrl =
      (this.configService.get<string>('CLOUDINARY_URL') ||
        process.env.CLOUDINARY_URL ||
        '').trim();

    // Check if user accidentally pasted full URL into API_KEY or URL variable
    if (apiKey.startsWith('CLOUDINARY_URL=') || apiKey.startsWith('cloudinary://')) {
      cloudinaryUrl = apiKey.replace('CLOUDINARY_URL=', '').trim();
      apiKey = '';
    }

    if (cloudinaryUrl) {
      if (cloudinaryUrl.includes('<your_api_key>') || cloudinaryUrl.includes('<your_api_secret>')) {
        this.configErrorMessage =
          'Cloudinary URL contains unreplaced placeholder "<your_api_key>". Please copy your actual credentials from Cloudinary Dashboard.';
        this.configured = false;
        this.logger.error(this.configErrorMessage);
        return;
      }
      cloudinary.config({ url: cloudinaryUrl, secure: true });
      this.configured = true;
      this.configErrorMessage = null;
      this.logger.log('Cloudinary initialized via CLOUDINARY_URL');
      return;
    }

    if (apiKey.includes('<your_api_key>') || apiKey.includes('your_api_key')) {
      this.configErrorMessage =
        'CLOUDINARY_API_KEY contains placeholder "<your_api_key>". Please copy your actual numeric API Key (15 digits) from your Cloudinary Dashboard into backend/.env.';
      this.configured = false;
      this.logger.error(this.configErrorMessage);
      return;
    }

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      this.configured = true;
      this.configErrorMessage = null;
      this.logger.log(`Cloudinary initialized with cloud_name: ${cloudName}`);
    } else {
      const missing: string[] = [];
      if (!cloudName) missing.push('CLOUDINARY_CLOUD_NAME');
      if (!apiKey) missing.push('CLOUDINARY_API_KEY');
      if (!apiSecret) missing.push('CLOUDINARY_API_SECRET');

      this.configErrorMessage = `Cloudinary credentials incomplete in backend/.env: Missing ${missing.join(', ')}.`;
      this.logger.warn(this.configErrorMessage);
      this.configured = false;
    }
  }

  public isConfigured(): boolean {
    this.initCloudinary();
    return this.configured;
  }

  public getStatus() {
    this.initCloudinary();
    return {
      configured: this.configured,
      cloudName:
        this.configService.get<string>('CLOUDINARY_CLOUD_NAME') ||
        process.env.CLOUDINARY_CLOUD_NAME ||
        null,
      error: this.configErrorMessage,
    };
  }

  public async uploadBuffer(
    buffer: Buffer,
    options: {
      folder?: string;
      resource_type?: 'auto' | 'image' | 'video' | 'raw';
      public_id?: string;
    } = {},
  ): Promise<CloudinaryUploadResult> {
    if (!this.isConfigured()) {
      throw new BadRequestException(
        this.configErrorMessage ||
          'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env.',
      );
    }

    const folder = options.folder || 'manthusa-tvs';
    const resource_type = options.resource_type || 'auto';

    return new Promise((resolve, reject) => {
      const uploadOptions: Record<string, any> = {
        folder,
        resource_type,
      };
      if (options.public_id) {
        uploadOptions.public_id = options.public_id;
      }

      const stream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            this.logger.error('Cloudinary stream upload error', error);
            return reject(
              new BadRequestException(error?.message || 'Cloudinary upload failed'),
            );
          }
          resolve({
            url: result.url,
            secure_url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            resource_type: result.resource_type,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
            duration: result.duration,
          });
        },
      );

      Readable.from(buffer).pipe(stream);
    });
  }

  public async uploadBase64(
    base64Data: string,
    options: {
      folder?: string;
      resource_type?: 'auto' | 'image' | 'video' | 'raw';
      public_id?: string;
    } = {},
  ): Promise<CloudinaryUploadResult> {
    if (!this.isConfigured()) {
      throw new BadRequestException(
        this.configErrorMessage ||
          'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env.',
      );
    }

    const folder = options.folder || 'manthusa-tvs';
    const resource_type = options.resource_type || 'auto';

    try {
      const uploadOptions: Record<string, any> = {
        folder,
        resource_type,
      };
      if (options.public_id) {
        uploadOptions.public_id = options.public_id;
      }

      const result = await cloudinary.uploader.upload(base64Data, uploadOptions);
      return {
        url: result.url,
        secure_url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        resource_type: result.resource_type,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        duration: result.duration,
      };
    } catch (error: any) {
      this.logger.error('Cloudinary base64 upload error', error);
      throw new BadRequestException(error?.message || 'Cloudinary upload failed');
    }
  }

  public async delete(
    publicId: string,
    resourceType: 'image' | 'video' | 'raw' = 'image',
  ): Promise<any> {
    if (!this.isConfigured()) {
      throw new BadRequestException(this.configErrorMessage || 'Cloudinary is not configured.');
    }
    return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  }
}
