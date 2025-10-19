import { Injectable, Logger } from '@nestjs/common';
import { AWSSESService } from './aws-ses.service';
import { EmailTrackingService } from './email-tracking.service';
import { EmailStatus } from '../entities/email-log.entity';

export interface EmailData {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly awsSESService: AWSSESService,
    private readonly emailTrackingService: EmailTrackingService,
  ) {}

  async sendEmail(emailData: EmailData): Promise<void> {
    try {
      // Convert template-based email to SES format
      const htmlBody = this.generateEmailHTML(emailData.template, emailData.data);
      const textBody = this.generateEmailText(emailData.template, emailData.data);

      const result = await this.awsSESService.sendEmail({
        to: emailData.to,
        subject: emailData.subject,
        htmlBody,
        textBody,
      });

      // Log email tracking
      await this.emailTrackingService.logEmailSent({
        to: emailData.to,
        subject: emailData.subject,
        template: emailData.template,
        status: EmailStatus.SENT,
        messageId: result?.MessageId || null,
        metadata: emailData.data,
      });

      this.logger.log(`Email sent successfully to ${emailData.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${emailData.to}:`, error);
      
      // Log failed email
      await this.emailTrackingService.logEmailSent({
        to: emailData.to,
        subject: emailData.subject,
        template: emailData.template,
        status: EmailStatus.FAILED,
        error: error.message,
        metadata: emailData.data,
      });

      // Fallback to console logging for development
      console.log('Email fallback (SES failed):', {
        to: emailData.to,
        subject: emailData.subject,
        template: emailData.template,
        data: emailData.data
      });
    }
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

  // Template generation methods
  private generateEmailHTML(template: string, data: Record<string, any>): string {
    switch (template) {
      case 'temp-code':
        return this.generateTempCodeEmailHTML(data.username, data.code, data.reason);
      case 'welcome':
        return this.generateWelcomeEmailHTML(data.username);
      case 'verification':
        return this.generateVerificationEmailHTML(data.username, data.verificationUrl);
      case 'digital-product-access':
        return this.generateDigitalProductAccessEmailHTML(
          data.customerName,
          data.productTitle,
          data.accessLink,
          data.accessType,
          data.expiresAt,
          data.maxDownloads,
          data.watermarkText
        );
      default:
        return this.generateGenericEmailHTML(data);
    }
  }

  private generateEmailText(template: string, data: Record<string, any>): string {
    switch (template) {
      case 'temp-code':
        return this.generateTempCodeEmailText(data.username, data.code, data.reason);
      case 'welcome':
        return this.generateWelcomeEmailText(data.username);
      case 'verification':
        return this.generateVerificationEmailText(data.username, data.verificationUrl);
      case 'digital-product-access':
        return this.generateDigitalProductAccessEmailText(
          data.customerName,
          data.productTitle,
          data.accessLink,
          data.accessType,
          data.expiresAt,
          data.maxDownloads,
          data.watermarkText
        );
      default:
        return this.generateGenericEmailText(data);
    }
  }

  // Template generators (reusing from AWSSESService)
  private generateTempCodeEmailHTML(username: string, code: string, reason: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Your Temporary Access Code</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .code { font-size: 24px; font-weight: bold; color: #4F46E5; text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Cleyverse</h1>
          </div>
          <div class="content">
            <h2>Hello ${username}!</h2>
            <p>You requested a temporary access code for: <strong>${reason}</strong></p>
            <p>Your temporary access code is:</p>
            <div class="code">${code}</div>
            <p>This code will expire in 10 minutes. Please use it to complete your action.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 Cleyverse. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateTempCodeEmailText(username: string, code: string, reason: string): string {
    return `
      Hello ${username}!
      
      You requested a temporary access code for: ${reason}
      
      Your temporary access code is: ${code}
      
      This code will expire in 10 minutes. Please use it to complete your action.
      
      If you didn't request this code, please ignore this email.
      
      © 2024 Cleyverse. All rights reserved.
    `;
  }

  private generateWelcomeEmailHTML(username: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Cleyverse!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .cta { text-align: center; margin: 30px 0; }
          .cta a { background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Cleyverse!</h1>
          </div>
          <div class="content">
            <h2>Hello ${username}!</h2>
            <p>Welcome to Cleyverse, the ultimate creator economy platform!</p>
            <p>You can now:</p>
            <ul>
              <li>Create and manage your links</li>
              <li>Build your online store</li>
              <li>Host live events</li>
              <li>Accept payments and tips</li>
              <li>Connect with your audience</li>
            </ul>
            <div class="cta">
              <a href="https://cleyfi.com/dashboard">Get Started</a>
            </div>
          </div>
          <div class="footer">
            <p>© 2024 Cleyverse. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateWelcomeEmailText(username: string): string {
    return `
      Hello ${username}!
      
      Welcome to Cleyverse, the ultimate creator economy platform!
      
      You can now:
      - Create and manage your links
      - Build your online store
      - Host live events
      - Accept payments and tips
      - Connect with your audience
      
      Get started at: https://cleyfi.com/dashboard
      
      © 2024 Cleyverse. All rights reserved.
    `;
  }

  private generateVerificationEmailHTML(username: string, verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Email Address</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .cta { text-align: center; margin: 30px 0; }
          .cta a { background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <h2>Hello ${username}!</h2>
            <p>Thank you for signing up for Cleyverse! To complete your registration, please verify your email address.</p>
            <div class="cta">
              <a href="${verificationUrl}">Verify Email Address</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
          </div>
          <div class="footer">
            <p>© 2024 Cleyverse. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateVerificationEmailText(username: string, verificationUrl: string): string {
    return `
      Hello ${username}!
      
      Thank you for signing up for Cleyverse! To complete your registration, please verify your email address.
      
      Click this link to verify: ${verificationUrl}
      
      This link will expire in 24 hours.
      
      © 2024 Cleyverse. All rights reserved.
    `;
  }

  private generateDigitalProductAccessEmailHTML(
    customerName: string,
    productTitle: string,
    accessLink: string,
    accessType: string,
    expiresAt: string,
    maxDownloads: string,
    watermarkText: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Your Digital Product Access</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .cta { text-align: center; margin: 30px 0; }
          .cta a { background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .info-box { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Digital Product</h1>
          </div>
          <div class="content">
            <h2>Hello ${customerName}!</h2>
            <p>Thank you for your purchase! You now have access to:</p>
            <div class="info-box">
              <h3>${productTitle}</h3>
              <p><strong>Access Type:</strong> ${accessType}</p>
              <p><strong>Max Downloads:</strong> ${maxDownloads}</p>
              ${expiresAt !== 'Never' ? `<p><strong>Expires:</strong> ${expiresAt}</p>` : ''}
              ${watermarkText !== 'None' ? `<p><strong>Watermark:</strong> ${watermarkText}</p>` : ''}
            </div>
            <div class="cta">
              <a href="${accessLink}">Access Your Product</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4F46E5;">${accessLink}</p>
          </div>
          <div class="footer">
            <p>© 2024 Cleyverse. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateDigitalProductAccessEmailText(
    customerName: string,
    productTitle: string,
    accessLink: string,
    accessType: string,
    expiresAt: string,
    maxDownloads: string,
    watermarkText: string
  ): string {
    return `
      Hello ${customerName}!
      
      Thank you for your purchase! You now have access to: ${productTitle}
      
      Access Type: ${accessType}
      Max Downloads: ${maxDownloads}
      ${expiresAt !== 'Never' ? `Expires: ${expiresAt}` : ''}
      ${watermarkText !== 'None' ? `Watermark: ${watermarkText}` : ''}
      
      Access your product at: ${accessLink}
      
      © 2024 Cleyverse. All rights reserved.
    `;
  }

  private generateGenericEmailHTML(data: Record<string, any>): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Cleyverse Notification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Cleyverse</h1>
          </div>
          <div class="content">
            <p>${JSON.stringify(data, null, 2)}</p>
          </div>
          <div class="footer">
            <p>© 2024 Cleyverse. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateGenericEmailText(data: Record<string, any>): string {
    return JSON.stringify(data, null, 2);
  }
}