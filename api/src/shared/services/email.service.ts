import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const verificationLink = `http://localhost:3000/users/verify-email?token=${token}`;
    this.logger.log(`Sending verification email to ${to} with link: ${verificationLink}`);
    // In a real application, integrate with an email service like SendGrid, Mailgun, etc.
    // Example: await this.mailService.send({ to, subject, html });
  }

  async sendWelcomeEmail(to: string, username: string): Promise<void> {
    this.logger.log(`Sending welcome email to ${to}. Welcome, ${username}!`);
    // In a real application, integrate with an email service.
  }

  async sendTempCodeEmail(to: string, username: string, code: string, reason: string): Promise<void> {
    const reasonMessages = {
      new_device: 'logging in from a new device',
      forgot_password: 'resetting your password',
      onboarding: 'completing your registration'
    };

    const reasonMessage = reasonMessages[reason] || 'logging in';

    this.logger.log(`
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      📧 TEMPORARY LOGIN CODE EMAIL
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      To: ${to}
      Username: ${username}
      Reason: ${reasonMessage}
      
      Your temporary login code is:
      
      ╔═══════════════╗
      ║   ${code}   ║
      ╚═══════════════╝
      
      This code will expire in 15 minutes.
      
      If you didn't request this code, please ignore this email.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
    
    // In a real application, integrate with an email service like SendGrid
    // Example email template:
    // await this.mailService.send({
    //   to,
    //   subject: `Your Cleyverse login code: ${code}`,
    //   html: `
    //     <h2>Hello ${username}!</h2>
    //     <p>You're ${reasonMessage}.</p>
    //     <p>Your temporary login code is:</p>
    //     <h1 style="font-size: 32px; letter-spacing: 8px;">${code}</h1>
    //     <p>This code will expire in 15 minutes.</p>
    //     <p>If you didn't request this code, please ignore this email.</p>
    //   `
    // });
  }
}
