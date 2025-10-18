import { Injectable } from '@nestjs/common';

export interface EmailData {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

@Injectable()
export class EmailService {
  async sendEmail(emailData: EmailData): Promise<void> {
    // This is a placeholder implementation
    // In production, you would integrate with an email service like:
    // - SendGrid
    // - AWS SES
    // - Mailgun
    // - Nodemailer with SMTP
    
    console.log('Sending email:', {
      to: emailData.to,
      subject: emailData.subject,
      template: emailData.template,
      data: emailData.data
    });

    // For now, just log the email data
    // In production, implement actual email sending logic here
  }

  async sendTempCodeEmail(email: string, username: string, code: string, reason: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: `Your temporary access code - ${reason}`,
      template: 'temp-code',
      data: { username, code, reason }
    });
  }

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: 'Welcome to Cleyverse!',
      template: 'welcome',
      data: { username }
    });
  }

  async sendVerificationEmail(email: string, username: string, verificationUrl: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: 'Verify your email address',
      template: 'verification',
      data: { username, verificationUrl }
    });
  }
}