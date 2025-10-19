import { Injectable, Logger } from '@nestjs/common';
import { SESClient, SendEmailCommand, SendEmailCommandInput } from '@aws-sdk/client-ses';
import { ConfigService } from '@nestjs/config';

export interface EmailData {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export interface SESEmailData {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  fromEmail?: string;
  fromName?: string;
}

@Injectable()
export class AWSSESService {
  private readonly logger = new Logger(AWSSESService.name);
  private readonly sesClient: SESClient;
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor(private readonly configService: ConfigService) {
    this.sesClient = new SESClient({
      region: this.configService.get('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') || '',
      },
    });

    this.fromEmail = this.configService.get('SES_FROM_EMAIL', 'noreply@cleyfi.com');
    this.fromName = this.configService.get('SES_FROM_NAME', 'Cleyverse');
  }

  async sendEmail(emailData: SESEmailData): Promise<any> {
    try {
      const params: SendEmailCommandInput = {
        Source: `${this.fromName} <${emailData.fromEmail || this.fromEmail}>`,
        Destination: {
          ToAddresses: [emailData.to],
        },
        Message: {
          Subject: {
            Data: emailData.subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: emailData.htmlBody,
              Charset: 'UTF-8',
            },
            ...(emailData.textBody && {
              Text: {
                Data: emailData.textBody,
                Charset: 'UTF-8',
              },
            }),
          },
        },
      };

      const command = new SendEmailCommand(params);
      const result = await this.sesClient.send(command);

      this.logger.log(`Email sent successfully to ${emailData.to}. MessageId: ${result.MessageId}`);
      
      return result;
    } catch (error) {
      this.logger.error(`Failed to send email to ${emailData.to}:`, error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  // Template-based email methods
  async sendTempCodeEmail(email: string, username: string, code: string, reason: string): Promise<void> {
    const htmlBody = this.generateTempCodeEmailHTML(username, code, reason);
    const textBody = this.generateTempCodeEmailText(username, code, reason);

    await this.sendEmail({
      to: email,
      subject: `Your temporary access code - ${reason}`,
      htmlBody,
      textBody,
    });
  }

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    const htmlBody = this.generateWelcomeEmailHTML(username);
    const textBody = this.generateWelcomeEmailText(username);

    await this.sendEmail({
      to: email,
      subject: 'Welcome to Cleyverse!',
      htmlBody,
      textBody,
    });
  }

  async sendVerificationEmail(email: string, username: string, verificationUrl: string): Promise<void> {
    const htmlBody = this.generateVerificationEmailHTML(username, verificationUrl);
    const textBody = this.generateVerificationEmailText(username, verificationUrl);

    await this.sendEmail({
      to: email,
      subject: 'Verify your email address',
      htmlBody,
      textBody,
    });
  }

  async sendDigitalProductAccessEmail(
    email: string,
    customerName: string,
    productTitle: string,
    accessLink: string,
    accessType: string,
    expiresAt: string,
    maxDownloads: string,
    watermarkText: string
  ): Promise<void> {
    const htmlBody = this.generateDigitalProductAccessEmailHTML(
      customerName,
      productTitle,
      accessLink,
      accessType,
      expiresAt,
      maxDownloads,
      watermarkText
    );
    const textBody = this.generateDigitalProductAccessEmailText(
      customerName,
      productTitle,
      accessLink,
      accessType,
      expiresAt,
      maxDownloads,
      watermarkText
    );

    await this.sendEmail({
      to: email,
      subject: `Your Digital Product: ${productTitle}`,
      htmlBody,
      textBody,
    });
  }

  // Email template generators
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
}
