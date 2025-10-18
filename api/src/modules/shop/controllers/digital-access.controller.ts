import { Controller, Get, Param, Query, Request, Res } from '@nestjs/common';
import type { Response } from 'express';
import { DigitalDeliveryService } from '../services/digital-delivery.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DigitalAccess } from '../entities/digital-access.entity';

export class AccessVerificationDto {
  password?: string;
  deviceFingerprint?: string;
}

@Controller('digital-access')
export class DigitalAccessController {
  constructor(
    private readonly digitalDeliveryService: DigitalDeliveryService,
    @InjectRepository(DigitalAccess)
    private readonly digitalAccessRepository: Repository<DigitalAccess>,
  ) {}

  // Verify access and get file
  @Get(':accessToken')
  async verifyAccess(
    @Param('accessToken') accessToken: string,
    @Query() query: AccessVerificationDto,
    @Request() req,
    @Res() res: Response
  ) {
    const { access, digitalProduct, fileStream } = await this.digitalDeliveryService.verifyAccess(
      accessToken,
      query.password,
      query.deviceFingerprint,
      req.ip,
      req.get('User-Agent')
    );

    // Set appropriate headers
    res.setHeader('Content-Type', digitalProduct.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${digitalProduct.fileName}"`);
    res.setHeader('Content-Length', digitalProduct.fileSize);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Send file
    res.send(fileStream);
  }

  // Download file
  @Get(':accessToken/download')
  async downloadFile(
    @Param('accessToken') accessToken: string,
    @Query() query: AccessVerificationDto,
    @Request() req,
    @Res() res: Response
  ) {
    const { access, digitalProduct, fileStream } = await this.digitalDeliveryService.verifyAccess(
      accessToken,
      query.password,
      query.deviceFingerprint,
      req.ip,
      req.get('User-Agent')
    );

    // Update download count
    access.downloadCount += 1;
    await this.digitalAccessRepository.save(access);

    // Set download headers
    res.setHeader('Content-Type', digitalProduct.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${digitalProduct.fileName}"`);
    res.setHeader('Content-Length', digitalProduct.fileSize);

    // Send file
    res.send(fileStream);
  }
}
