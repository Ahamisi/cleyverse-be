import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { EmailLog, EmailStatus } from '../entities/email-log.entity';

export interface EmailTrackingData {
  to: string;
  subject: string;
  template: string;
  status: EmailStatus;
  messageId?: string;
  error?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class EmailTrackingService {
  private readonly logger = new Logger(EmailTrackingService.name);

  constructor(
    @InjectRepository(EmailLog)
    private readonly emailLogRepository: Repository<EmailLog>,
  ) {}

  async logEmailSent(trackingData: EmailTrackingData): Promise<EmailLog> {
    try {
      const emailLog = this.emailLogRepository.create({
        to: trackingData.to,
        subject: trackingData.subject,
        template: trackingData.template,
        status: trackingData.status as EmailStatus,
        messageId: trackingData.messageId,
        error: trackingData.error,
        metadata: trackingData.metadata,
        sentAt: new Date(),
      });

      const savedLog = await this.emailLogRepository.save(emailLog);
      this.logger.log(`Email logged: ${trackingData.to} - ${trackingData.status}`);
      return savedLog;
    } catch (error) {
      this.logger.error(`Failed to log email: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateEmailStatus(messageId: string, status: EmailStatus, error?: string): Promise<void> {
    try {
      const emailLog = await this.emailLogRepository.findOne({
        where: { messageId }
      });

      if (emailLog) {
        emailLog.status = status;
        emailLog.error = error || null;
        emailLog.updatedAt = new Date();
        await this.emailLogRepository.save(emailLog);
        this.logger.log(`Email status updated: ${messageId} - ${status}`);
      }
    } catch (error) {
      this.logger.error(`Failed to update email status: ${error.message}`, error.stack);
    }
  }

  async getEmailStats(days: number = 7): Promise<{
    totalSent: number;
    totalDelivered: number;
    totalBounced: number;
    totalFailed: number;
    deliveryRate: number;
    bounceRate: number;
    failureRate: number;
  }> {
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);

      const [totalSent, totalDelivered, totalBounced, totalFailed] = await Promise.all([
        this.emailLogRepository.count({ where: { sentAt: MoreThanOrEqual(since) } }),
        this.emailLogRepository.count({ where: { status: EmailStatus.DELIVERED, sentAt: MoreThanOrEqual(since) } }),
        this.emailLogRepository.count({ where: { status: EmailStatus.BOUNCED, sentAt: MoreThanOrEqual(since) } }),
        this.emailLogRepository.count({ where: { status: EmailStatus.FAILED, sentAt: MoreThanOrEqual(since) } }),
      ]);

      const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
      const bounceRate = totalSent > 0 ? (totalBounced / totalSent) * 100 : 0;
      const failureRate = totalSent > 0 ? (totalFailed / totalSent) * 100 : 0;

      return {
        totalSent,
        totalDelivered,
        totalBounced,
        totalFailed,
        deliveryRate: Math.round(deliveryRate * 100) / 100,
        bounceRate: Math.round(bounceRate * 100) / 100,
        failureRate: Math.round(failureRate * 100) / 100,
      };
    } catch (error) {
      this.logger.error(`Failed to get email stats: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getRecentEmails(limit: number = 50): Promise<EmailLog[]> {
    try {
      return await this.emailLogRepository.find({
        order: { sentAt: 'DESC' },
        take: limit,
      });
    } catch (error) {
      this.logger.error(`Failed to get recent emails: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getEmailsByTemplate(template: string, days: number = 7): Promise<EmailLog[]> {
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);

      return await this.emailLogRepository.find({
        where: { 
          template,
          sentAt: MoreThanOrEqual(since)
        },
        order: { sentAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(`Failed to get emails by template: ${error.message}`, error.stack);
      throw error;
    }
  }
}
