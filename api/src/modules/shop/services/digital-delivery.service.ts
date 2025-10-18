import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DigitalProduct } from '../entities/digital-product.entity';
import { DigitalAccess, AccessStatus, AccessType } from '../entities/digital-access.entity';
import { Order } from '../entities/order.entity';
import { EmailService } from '../../../shared/services/email.service';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class DigitalDeliveryService {
  constructor(
    @InjectRepository(DigitalProduct)
    private readonly digitalProductRepository: Repository<DigitalProduct>,
    @InjectRepository(DigitalAccess)
    private readonly digitalAccessRepository: Repository<DigitalAccess>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly emailService: EmailService,
  ) {}

  // Create digital access for a purchase
  async createDigitalAccess(
    digitalProductId: string,
    orderId: string,
    customerEmail: string,
    customerName?: string,
    userId?: string
  ): Promise<DigitalAccess> {
    const digitalProduct = await this.digitalProductRepository.findOne({
      where: { id: digitalProductId, isActive: true },
      relations: ['product']
    });

    if (!digitalProduct) {
      throw new NotFoundException('Digital product not found');
    }

    const order = await this.orderRepository.findOne({
      where: { id: orderId }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Generate unique access token
    const accessToken = this.generateAccessToken();
    const accessPassword = digitalProduct.accessControlType === 'password_protected' 
      ? this.generateAccessPassword() 
      : null;

    // Calculate expiration date
    const expiresAt = digitalProduct.accessDurationHours 
      ? new Date(Date.now() + digitalProduct.accessDurationHours * 60 * 60 * 1000)
      : null;

    // Create digital access record
    const digitalAccess = this.digitalAccessRepository.create({
      digitalProductId,
      userId: userId || null,
      orderId,
      customerEmail,
      customerName,
      accessType: AccessType.PURCHASE,
      status: AccessStatus.ACTIVE,
      accessToken,
      accessPassword,
      expiresAt,
      maxDownloads: digitalProduct.maxDownloads,
      watermarkText: digitalProduct.watermarkText,
      watermarkPosition: 'bottom-right',
      deviceFingerprint: null,
      ipAddress: null,
      userAgent: null,
      allowedIps: digitalProduct.allowedIps,
      deliveryEmailTemplate: digitalProduct.deliveryEmailTemplate,
      metadata: {
        orderNumber: order.orderNumber,
        productTitle: digitalProduct.product.title,
        purchaseDate: new Date()
      }
    });

    const savedAccess = await this.digitalAccessRepository.save(digitalAccess);

    // Send delivery email if auto-deliver is enabled
    if (digitalProduct.autoDeliver) {
      await this.sendDeliveryEmail(savedAccess);
    }

    return savedAccess;
  }

  // Send delivery email with access information
  async sendDeliveryEmail(digitalAccess: DigitalAccess): Promise<void> {
    const digitalProduct = await this.digitalProductRepository.findOne({
      where: { id: digitalAccess.digitalProductId },
      relations: ['product', 'product.store']
    });

    if (!digitalProduct) {
      throw new NotFoundException('Digital product not found');
    }

    const accessUrl = `${process.env.FRONTEND_URL}/digital-access/${digitalAccess.accessToken}`;
    
    const emailData = {
      to: digitalAccess.customerEmail,
      subject: digitalProduct.deliverySubject || `Your ${digitalProduct.product.title} is ready!`,
      template: digitalProduct.deliveryEmailTemplate || 'digital-product-delivery',
      data: {
        customerName: digitalAccess.customerName || 'Valued Customer',
        productTitle: digitalProduct.product.title,
        storeName: digitalProduct.product.store.name,
        accessUrl,
        accessPassword: digitalAccess.accessPassword,
        expiresAt: digitalAccess.expiresAt,
        maxDownloads: digitalAccess.maxDownloads,
        downloadInstructions: this.getDownloadInstructions(digitalProduct.digitalType),
        supportEmail: digitalProduct.product.store.user.email,
        orderNumber: digitalAccess.metadata?.orderNumber
      }
    };

    try {
      await this.emailService.sendEmail(emailData);
      
      // Update delivery status
      digitalAccess.deliveryEmailSent = true;
      digitalAccess.deliveryEmailSentAt = new Date();
      await this.digitalAccessRepository.save(digitalAccess);
    } catch (error) {
      console.error('Failed to send delivery email:', error);
      // Don't throw error to avoid breaking the purchase flow
    }
  }

  // Verify access and get file information
  async verifyAccess(
    accessToken: string,
    password?: string,
    deviceFingerprint?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ access: DigitalAccess; digitalProduct: DigitalProduct; fileStream: any }> {
    const access = await this.digitalAccessRepository.findOne({
      where: { accessToken },
      relations: ['digitalProduct', 'digitalProduct.product']
    });

    if (!access) {
      throw new NotFoundException('Invalid access token');
    }

    if (access.status !== AccessStatus.ACTIVE) {
      throw new ForbiddenException('Access has been revoked or suspended');
    }

    // Check expiration
    if (access.expiresAt && access.expiresAt < new Date()) {
      access.status = AccessStatus.EXPIRED;
      await this.digitalAccessRepository.save(access);
      throw new ForbiddenException('Access has expired');
    }

    // Check password if required
    if (access.accessPassword && access.accessPassword !== password) {
      throw new ForbiddenException('Invalid access password');
    }

    // Check download limit
    if (access.downloadCount >= access.maxDownloads) {
      throw new ForbiddenException('Download limit exceeded');
    }

    // Check concurrent users limit
    const digitalProduct = await this.digitalProductRepository.findOne({
      where: { id: access.digitalProductId }
    });

    if (digitalProduct && access.concurrentSessions >= digitalProduct.maxConcurrentUsers) {
      throw new ForbiddenException('Maximum concurrent users reached');
    }

    // Update access tracking
    access.lastAccessedAt = new Date();
    access.accessCount += 1;
    access.deviceFingerprint = deviceFingerprint || null;
    access.ipAddress = ipAddress || null;
    access.userAgent = userAgent || null;
    await this.digitalAccessRepository.save(access);

    // Get file stream
    const fileStream = await this.getSecureFileStream(digitalProduct!);

    return { access, digitalProduct: digitalProduct!, fileStream };
  }

  // Get secure file stream with watermarking
  private async getSecureFileStream(digitalProduct: DigitalProduct): Promise<any> {
    try {
      const filePath = path.join(process.env.DIGITAL_FILES_PATH || './uploads/digital', digitalProduct.filePath);
      const fileBuffer = await fs.readFile(filePath);

      // Apply watermarking if enabled
      if (digitalProduct.watermarkEnabled && digitalProduct.watermarkText) {
        return await this.applyWatermark(fileBuffer, digitalProduct);
      }

      return fileBuffer;
    } catch (error) {
      throw new NotFoundException('Digital file not found');
    }
  }

  // Apply watermark to file
  private async applyWatermark(fileBuffer: Buffer, digitalProduct: DigitalProduct): Promise<Buffer> {
    // This is a simplified watermark implementation
    // In production, you'd use libraries like PDF-lib for PDFs or similar for other formats
    
    if (digitalProduct.digitalType === 'pdf' || digitalProduct.digitalType === 'ebook') {
      // For PDFs, you'd use PDF-lib to add watermark
      // For now, return original buffer
      return fileBuffer;
    }

    return fileBuffer;
  }

  // Generate secure access token
  private generateAccessToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Generate access password
  private generateAccessPassword(): string {
    return crypto.randomBytes(8).toString('hex');
  }

  // Get download instructions based on product type
  private getDownloadInstructions(digitalType: string): string {
    switch (digitalType) {
      case 'ebook':
        return 'You can read your ebook directly in our secure viewer or download it to your device.';
      case 'pdf':
        return 'You can view your PDF in our secure viewer or download it to your device.';
      case 'audio':
        return 'You can stream your audio file or download it to your device.';
      case 'video':
        return 'You can stream your video or download it to your device.';
      case 'software':
        return 'Download and install the software on your device.';
      case 'course':
        return 'Access your course materials and start learning immediately.';
      default:
        return 'Download your digital product to your device.';
    }
  }

  // Revoke access
  async revokeAccess(accessId: string, reason?: string): Promise<void> {
    const access = await this.digitalAccessRepository.findOne({
      where: { id: accessId }
    });

    if (!access) {
      throw new NotFoundException('Access record not found');
    }

    access.status = AccessStatus.REVOKED;
    access.notes = reason || 'Access revoked by administrator';
    await this.digitalAccessRepository.save(access);
  }

  // Get access analytics
  async getAccessAnalytics(digitalProductId: string): Promise<{
    totalAccess: number;
    activeAccess: number;
    totalDownloads: number;
    totalViews: number;
    uniqueUsers: number;
    recentAccess: DigitalAccess[];
  }> {
    const [totalAccess, activeAccess, recentAccess] = await Promise.all([
      this.digitalAccessRepository.count({ where: { digitalProductId } }),
      this.digitalAccessRepository.count({ where: { digitalProductId, status: AccessStatus.ACTIVE } }),
      this.digitalAccessRepository.find({
        where: { digitalProductId },
        order: { lastAccessedAt: 'DESC' },
        take: 10,
        relations: ['user']
      })
    ]);

    const stats = await this.digitalAccessRepository
      .createQueryBuilder('access')
      .select([
        'SUM(access.downloadCount) as totalDownloads',
        'SUM(access.accessCount) as totalViews',
        'COUNT(DISTINCT access.customerEmail) as uniqueUsers'
      ])
      .where('access.digitalProductId = :digitalProductId', { digitalProductId })
      .getRawOne();

    return {
      totalAccess,
      activeAccess,
      totalDownloads: parseInt(stats.totalDownloads) || 0,
      totalViews: parseInt(stats.totalViews) || 0,
      uniqueUsers: parseInt(stats.uniqueUsers) || 0,
      recentAccess
    };
  }
}
