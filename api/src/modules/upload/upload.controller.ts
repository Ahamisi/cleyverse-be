import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AWSS3Service, S3PresignedUploadResult } from '../../shared/services/aws-s3.service';
import { UploadService } from './upload.service';

export class GenerateUploadUrlDto {
  fileName: string;
  contentType: string;
  folder?: string;
  maxFileSize?: number;
}

export class DeleteFileDto {
  key: string;
}

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly s3Service: AWSS3Service,
  ) {}

  // Direct file upload (for server-side uploads)
  @Post('file')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: any,
    @Body('folder') folder: string = 'uploads',
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    if (file.size > maxSize) {
      throw new BadRequestException('File too large');
    }

    const result = await this.s3Service.uploadFile(file, folder, {
      generateUniqueName: true,
    });

    // Log the upload for the user
    await this.uploadService.logUpload(req.user.userId, result.key, file.originalname, file.size);

    return {
      message: 'File uploaded successfully',
      file: {
        key: result.key,
        url: result.url,
        originalName: file.originalname,
        size: file.size,
        contentType: file.mimetype,
      },
    };
  }

  // Generate presigned URL for direct frontend uploads
  @Post('presigned-url')
  @UseGuards(JwtAuthGuard)
  async generatePresignedUploadUrl(
    @Body() generateUploadUrlDto: GenerateUploadUrlDto,
    @Request() req,
  ) {
    const { fileName, contentType, folder = 'uploads', maxFileSize = 10 * 1024 * 1024 } = generateUploadUrlDto;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain'];
    if (!allowedTypes.includes(contentType)) {
      throw new BadRequestException('Invalid file type');
    }

    // Generate unique key
    const key = this.s3Service.generateUniqueKey(folder, fileName);

    // Generate presigned URL
    const presignedResult = await this.s3Service.generatePresignedPost(
      key,
      contentType,
      3600, // 1 hour
      maxFileSize,
    );

    // Log the upload attempt
    await this.uploadService.logUploadAttempt(req.user.userId, key, fileName, maxFileSize);

    return {
      message: 'Presigned URL generated successfully',
      uploadUrl: presignedResult.uploadUrl,
      key: presignedResult.key,
      fields: presignedResult.fields,
      expiresIn: 3600,
    };
  }

  // Get signed download URL
  @Get('download/:key(*)')
  @UseGuards(JwtAuthGuard)
  async getSignedDownloadUrl(
    @Param('key') key: string,
    @Query('expiresIn') expiresIn: number = 3600,
    @Request() req,
  ) {
    // Verify user has access to this file
    const hasAccess = await this.uploadService.verifyFileAccess(req.user.userId, key);
    if (!hasAccess) {
      throw new BadRequestException('Access denied to this file');
    }

    const signedUrl = await this.s3Service.getSignedDownloadUrl(key, expiresIn);

    return {
      message: 'Signed download URL generated successfully',
      downloadUrl: signedUrl,
      expiresIn,
    };
  }

  // Delete file
  @Delete('file/:key(*)')
  @UseGuards(JwtAuthGuard)
  async deleteFile(
    @Param('key') key: string,
    @Request() req,
  ) {
    // Verify user owns this file
    const hasAccess = await this.uploadService.verifyFileAccess(req.user.userId, key);
    if (!hasAccess) {
      throw new BadRequestException('Access denied to this file');
    }

    await this.s3Service.deleteFile(key);
    await this.uploadService.logFileDeletion(req.user.userId, key);

    return {
      message: 'File deleted successfully',
      key,
    };
  }

  // Get user's uploaded files
  @Get('files')
  @UseGuards(JwtAuthGuard)
  async getUserFiles(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('folder') folder?: string,
  ) {
    const files = await this.uploadService.getUserFiles(req.user.userId, page, limit, folder);

    return {
      message: 'User files retrieved successfully',
      files: files.map(file => ({
        id: file.id,
        key: file.key,
        originalName: file.originalName,
        size: file.size,
        contentType: file.contentType,
        folder: file.folder,
        url: this.s3Service.getPublicUrl(file.key),
        uploadedAt: file.uploadedAt,
      })),
      pagination: {
        page,
        limit,
        total: files.length,
      },
    };
  }

  // Get file info
  @Get('file/:key(*)')
  @UseGuards(JwtAuthGuard)
  async getFileInfo(
    @Param('key') key: string,
    @Request() req,
  ) {
    const hasAccess = await this.uploadService.verifyFileAccess(req.user.userId, key);
    if (!hasAccess) {
      throw new BadRequestException('Access denied to this file');
    }

    const fileInfo = await this.uploadService.getFileInfo(key);
    const publicUrl = this.s3Service.getPublicUrl(key);

    return {
      message: 'File info retrieved successfully',
      file: {
        ...fileInfo,
        url: publicUrl,
      },
    };
  }
}
