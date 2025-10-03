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
}
