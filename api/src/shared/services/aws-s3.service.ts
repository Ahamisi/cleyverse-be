import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';

export interface S3UploadResult {
  key: string;
  url: string;
  bucket: string;
  etag: string;
}

export interface S3PresignedUploadResult {
  uploadUrl: string;
  key: string;
  fields: Record<string, string>;
}

@Injectable()
export class AWSS3Service {
  private readonly logger = new Logger(AWSS3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get('S3_REGION', 'us-east-1');
    this.bucketName = this.configService.get('S3_BUCKET_NAME', 'cleyverse-digital-files-staging');

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') || '',
      },
    });
  }

  async uploadFile(
    file: any,
    folder: string = 'uploads',
    options: {
      generateUniqueName?: boolean;
      customFileName?: string;
      contentType?: string;
    } = {}
  ): Promise<S3UploadResult> {
    try {
      const { generateUniqueName = true, customFileName, contentType } = options;
      
      // Generate unique filename if requested
      let fileName = customFileName || file.originalname;
      if (generateUniqueName) {
        const uniqueSuffix = crypto.randomBytes(16).toString('hex');
        const fileExtension = fileName.split('.').pop();
        const baseName = fileName.replace(/\.[^/.]+$/, '');
        fileName = `${baseName}-${uniqueSuffix}.${fileExtension}`;
      }

      const key = `${folder}/${fileName}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: contentType || file.mimetype,
        ContentLength: file.size,
        Metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString(),
        },
      });

      const result = await this.s3Client.send(command);

      const url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;

      this.logger.log(`File uploaded successfully: ${key}`);

      return {
        key,
        url,
        bucket: this.bucketName,
        etag: result.ETag || '',
      };
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message}`, error.stack);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`, error.stack);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async getSignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
      return signedUrl;
    } catch (error) {
      this.logger.error(`Failed to generate signed URL: ${error.message}`, error.stack);
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }

  async getSignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
      return signedUrl;
    } catch (error) {
      this.logger.error(`Failed to generate signed upload URL: ${error.message}`, error.stack);
      throw new Error(`Failed to generate signed upload URL: ${error.message}`);
    }
  }

  // Generate presigned POST for direct frontend uploads
  async generatePresignedPost(
    key: string,
    contentType: string,
    expiresIn: number = 3600,
    maxFileSize: number = 10 * 1024 * 1024 // 10MB default
  ): Promise<S3PresignedUploadResult> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
      });

      const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn });

      return {
        uploadUrl,
        key,
        fields: {
          'Content-Type': contentType,
          'x-amz-content-sha256': 'UNSIGNED-PAYLOAD',
        },
      };
    } catch (error) {
      this.logger.error(`Failed to generate presigned POST: ${error.message}`, error.stack);
      throw new Error(`Failed to generate presigned POST: ${error.message}`);
    }
  }

  // Utility methods
  generateUniqueKey(folder: string, originalName: string): string {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const fileExtension = originalName.split('.').pop();
    const baseName = originalName.replace(/\.[^/.]+$/, '');
    const fileName = `${baseName}-${uniqueSuffix}.${fileExtension}`;
    return `${folder}/${fileName}`;
  }

  getPublicUrl(key: string): string {
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }

  // File type validation
  isValidFileType(fileName: string, allowedTypes: string[]): boolean {
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    return allowedTypes.includes(fileExtension || '');
  }

  // File size validation
  isValidFileSize(fileSize: number, maxSize: number): boolean {
    return fileSize <= maxSize;
  }

  // Get file info from S3 key
  parseS3Key(key: string): { folder: string; fileName: string; extension: string } {
    const parts = key.split('/');
    const fileName = parts[parts.length - 1];
    const folder = parts.slice(0, -1).join('/');
    const extension = fileName.split('.').pop() || '';
    
    return { folder, fileName, extension };
  }
}
