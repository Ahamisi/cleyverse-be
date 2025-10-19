import { Controller, Post, Body, UseGuards, Request, Get, Query } from '@nestjs/common';
import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { EmailService } from '../../shared/services/email.service';
import { AWSSESService } from '../../shared/services/aws-ses.service';

export class TestEmailDto {
  @IsEmail()
  to: string;

  @IsIn(['welcome', 'temp-code', 'verification', 'digital-product'])
  type: 'welcome' | 'temp-code' | 'verification' | 'digital-product';

  @IsOptional()
  @IsString()
  customMessage?: string;
}

@Controller('email-test')
export class EmailTestController {
  constructor(
    private readonly emailService: EmailService,
    private readonly awsSESService: AWSSESService,
  ) {}

  @Post('send-test')
  async sendTestEmail(
    @Body() testEmailDto: TestEmailDto,
  ) {
    const { to, type, customMessage } = testEmailDto;

    try {
      let result;

      switch (type) {
        case 'welcome':
          result = await this.emailService.sendWelcomeEmail(to, 'Test User');
          break;
        
        case 'temp-code':
          result = await this.emailService.sendTempCodeEmail(
            to, 
            'Test User', 
            '123456', 
            'Testing email system'
          );
          break;
        
        case 'verification':
          result = await this.emailService.sendVerificationEmail(
            to, 
            'Test User', 
            'https://cleyfi.com/verify?token=test-token'
          );
          break;
        
        case 'digital-product':
          result = await this.awsSESService.sendDigitalProductAccessEmail(
            to,
            'Test Customer',
            'Test Digital Product',
            'https://cleyfi.com/access/test-token',
            'purchase',
            'Never',
            'Unlimited',
            'test@example.com'
          );
          break;
        
        default:
          throw new Error('Invalid email type');
      }

      return {
        message: 'Test email sent successfully',
        type,
        to,
        timestamp: new Date().toISOString(),
        result: 'Email queued for delivery'
      };
    } catch (error) {
      return {
        message: 'Failed to send test email',
        error: error.message,
        type,
        to,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get('templates')
  async getEmailTemplates() {
    return {
      message: 'Available email templates',
      templates: [
        {
          type: 'welcome',
          description: 'Welcome email for new users',
          sampleData: {
            username: 'John Doe'
          }
        },
        {
          type: 'temp-code',
          description: 'Temporary access code email',
          sampleData: {
            username: 'John Doe',
            code: '123456',
            reason: 'Login verification'
          }
        },
        {
          type: 'verification',
          description: 'Email verification link',
          sampleData: {
            username: 'John Doe',
            verificationUrl: 'https://cleyfi.com/verify?token=abc123'
          }
        },
        {
          type: 'digital-product',
          description: 'Digital product access email',
          sampleData: {
            customerName: 'John Doe',
            productTitle: 'My Amazing Ebook',
            accessLink: 'https://cleyfi.com/access/abc123',
            accessType: 'purchase',
            expiresAt: 'Never',
            maxDownloads: 'Unlimited',
            watermarkText: 'john@example.com'
          }
        }
      ]
    };
  }

  @Get('status')
  async getEmailServiceStatus() {
    return {
      message: 'Email service status',
      services: {
        emailService: 'Active',
        awsSESService: 'Active',
        fallbackMode: 'Console logging (AWS credentials not configured)'
      },
      configuration: {
        fromEmail: process.env.SES_FROM_EMAIL || 'noreply@cleyfi.com',
        fromName: process.env.SES_FROM_NAME || 'Cleyverse',
        awsRegion: process.env.AWS_REGION || 'us-east-1',
        hasAwsCredentials: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
      },
      timestamp: new Date().toISOString()
    };
  }
}
