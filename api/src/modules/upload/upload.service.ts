import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFile, FileStatus } from './entities/user-file.entity';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    @InjectRepository(UserFile)
    private readonly userFileRepository: Repository<UserFile>,
  ) {}

  async logUpload(
    userId: string,
    key: string,
    originalName: string,
    size: number,
    contentType?: string,
  ): Promise<UserFile> {
    try {
      const { folder, fileName, extension } = this.parseS3Key(key);

      const userFile = this.userFileRepository.create({
        userId,
        key,
        originalName,
        fileName,
        size,
        contentType: contentType || this.getContentTypeFromExtension(extension),
        folder,
        extension,
      });

      const savedFile = await this.userFileRepository.save(userFile);
      this.logger.log(`File upload logged: ${key} for user ${userId}`);
      return savedFile;
    } catch (error) {
      this.logger.error(`Failed to log file upload: ${error.message}`, error.stack);
      throw error;
    }
  }

  async logUploadAttempt(
    userId: string,
    key: string,
    originalName: string,
    maxSize: number,
  ): Promise<UserFile> {
    try {
      const { folder, fileName, extension } = this.parseS3Key(key);

      const userFile = this.userFileRepository.create({
        userId,
        key,
        originalName,
        fileName,
        size: 0, // Will be updated when upload completes
        contentType: this.getContentTypeFromExtension(extension),
        folder,
        extension,
        status: FileStatus.PENDING,
      });

      const savedFile = await this.userFileRepository.save(userFile);
      this.logger.log(`File upload attempt logged: ${key} for user ${userId}`);
      return savedFile;
    } catch (error) {
      this.logger.error(`Failed to log file upload attempt: ${error.message}`, error.stack);
      throw error;
    }
  }

  async logFileDeletion(userId: string, key: string): Promise<void> {
    try {
      const file = await this.userFileRepository.findOne({
        where: { userId, key },
      });

      if (file) {
        file.status = FileStatus.DELETED;
        file.deletedAt = new Date();
        await this.userFileRepository.save(file);
        this.logger.log(`File deletion logged: ${key} for user ${userId}`);
      }
    } catch (error) {
      this.logger.error(`Failed to log file deletion: ${error.message}`, error.stack);
      throw error;
    }
  }

  async verifyFileAccess(userId: string, key: string): Promise<boolean> {
    try {
      const file = await this.userFileRepository.findOne({
        where: { userId, key, status: FileStatus.ACTIVE },
      });

      return !!file;
    } catch (error) {
      this.logger.error(`Failed to verify file access: ${error.message}`, error.stack);
      return false;
    }
  }

  async getUserFiles(
    userId: string,
    page: number = 1,
    limit: number = 20,
    folder?: string,
  ): Promise<UserFile[]> {
    try {
      const queryBuilder = this.userFileRepository
        .createQueryBuilder('file')
        .where('file.userId = :userId', { userId })
        .andWhere('file.status = :status', { status: FileStatus.ACTIVE })
        .orderBy('file.uploadedAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      if (folder) {
        queryBuilder.andWhere('file.folder = :folder', { folder });
      }

      return await queryBuilder.getMany();
    } catch (error) {
      this.logger.error(`Failed to get user files: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getFileInfo(key: string): Promise<UserFile> {
    try {
      const file = await this.userFileRepository.findOne({
        where: { key, status: FileStatus.ACTIVE },
      });

      if (!file) {
        throw new Error('File not found');
      }

      return file;
    } catch (error) {
      this.logger.error(`Failed to get file info: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateFileStatus(key: string, status: FileStatus): Promise<void> {
    try {
      const file = await this.userFileRepository.findOne({
        where: { key },
      });

      if (file) {
        file.status = status;
        if (status === FileStatus.DELETED) {
          file.deletedAt = new Date();
        }
        await this.userFileRepository.save(file);
        this.logger.log(`File status updated: ${key} to ${status}`);
      }
    } catch (error) {
      this.logger.error(`Failed to update file status: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getFileStats(userId: string): Promise<{
    totalFiles: number;
    totalSize: number;
    filesByType: Record<string, number>;
    filesByFolder: Record<string, number>;
  }> {
    try {
      const files = await this.userFileRepository.find({
        where: { userId, status: FileStatus.ACTIVE },
      });

      const totalFiles = files.length;
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);

      const filesByType = files.reduce((acc, file) => {
        const type = file.contentType || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const filesByFolder = files.reduce((acc, file) => {
        const folder = file.folder || 'root';
        acc[folder] = (acc[folder] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalFiles,
        totalSize,
        filesByType,
        filesByFolder,
      };
    } catch (error) {
      this.logger.error(`Failed to get file stats: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Utility methods
  private parseS3Key(key: string): { folder: string; fileName: string; extension: string } {
    const parts = key.split('/');
    const fileName = parts[parts.length - 1];
    const folder = parts.slice(0, -1).join('/');
    const extension = fileName.split('.').pop() || '';
    
    return { folder, fileName, extension };
  }

  private getContentTypeFromExtension(extension: string): string {
    const contentTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      pdf: 'application/pdf',
      txt: 'text/plain',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      mp4: 'video/mp4',
      avi: 'video/x-msvideo',
      mov: 'video/quicktime',
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      zip: 'application/zip',
      rar: 'application/x-rar-compressed',
    };

    return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
  }
}
