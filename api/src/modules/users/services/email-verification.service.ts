import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { EmailVerification } from '../entities/email-verification.entity';
import { EmailService } from '../../../shared/services/email.service';
import * as crypto from 'crypto';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,
    private readonly emailService: EmailService,
  ) {}

  async verifyEmail(token: string) {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }

    // Find verification record
    const verification = await this.emailVerificationRepository.findOne({
      where: { token, isUsed: false },
      relations: ['user']
    });

    if (!verification) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    // Check if token is expired
    if (new Date() > verification.expiresAt) {
      throw new BadRequestException('Verification token has expired');
    }

    // Update user as verified
    await this.usersRepository.update(verification.userId, {
      isEmailVerified: true,
      emailVerifiedAt: new Date()
    });

    // Mark verification as used
    await this.emailVerificationRepository.update(verification.id, {
      isUsed: true
    });

    // Send welcome email
    await this.emailService.sendWelcomeEmail(verification.user.email, verification.user.username);

    return {
      message: 'Email verified successfully! Welcome to Cleyverse!',
      verified: true
    };
  }

  async resendVerification(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Generate new verification token
    const token = crypto.randomBytes(32).toString('hex');
    const verification = this.emailVerificationRepository.create({
      userId: user.id,
      token,
    });
    await this.emailVerificationRepository.save(verification);

    // Send verification email
    await this.emailService.sendVerificationEmail(user.email, token);

    return {
      message: 'Verification email sent successfully'
    };
  }
}
