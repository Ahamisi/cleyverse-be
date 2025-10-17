import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TempCode, TempCodeReason } from '../entities/temp-code.entity';
import { TrustedDevice } from '../entities/trusted-device.entity';
import { EmailService } from '../../../shared/services/email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(TempCode)
    private readonly tempCodeRepository: Repository<TempCode>,
    @InjectRepository(TrustedDevice)
    private readonly trustedDeviceRepository: Repository<TrustedDevice>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    
    if (!user) {
      return null;
    }

    // Check if user has a password set
    if (!user.password) {
      throw new UnauthorizedException('Please set up your password first. Check your email for verification link.');
    }

    if (await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string, deviceFingerprint?: string) {
    const user = await this.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Track trusted device if fingerprint provided
    if (deviceFingerprint) {
      await this.updateTrustedDevice(user.id, deviceFingerprint);
    }

    const payload = { 
      email: user.email, 
      sub: user.id,
      username: user.username 
    };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '7d' }), // Extended to 7 days
      user: user,
      expires_in: '7d',
      message: 'Login successful'
    };
  }

  async checkUser(email: string, deviceFingerprint?: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found. Please register first.');
    }

    const hasPassword = !!user.password;
    let isKnownDevice = false;

    if (deviceFingerprint) {
      const trustedDevice = await this.trustedDeviceRepository.findOne({
        where: {
          userId: user.id,
          deviceFingerprint,
          isActive: true
        }
      });
      isKnownDevice = !!trustedDevice;
    }

    // Determine if temp code is required
    const requiresTempCode = !hasPassword || !isKnownDevice;
    const canUsePassword = hasPassword;

    return {
      hasPassword,
      isKnownDevice,
      requiresTempCode,
      canUsePassword,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
        onboardingStep: user.onboardingStep
      },
      message: 'User status checked'
    };
  }

  async sendTempCode(email: string, reason: TempCodeReason) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Invalidate any existing unused codes for this user
    await this.tempCodeRepository.update(
      { userId: user.id, isUsed: false },
      { isUsed: true }
    );

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration (15 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Save temp code
    const tempCode = this.tempCodeRepository.create({
      userId: user.id,
      code,
      reason,
      expiresAt,
      isUsed: false,
      attempts: 0
    });
    await this.tempCodeRepository.save(tempCode);

    // Send email with temp code
    await this.emailService.sendTempCodeEmail(user.email, user.username, code, reason);

    return {
      message: 'Temporary code sent to your email',
      expires_in: '15m',
      codeLength: 6
    };
  }

  async verifyTempCode(email: string, code: string, deviceFingerprint?: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find valid temp code
    const tempCode = await this.tempCodeRepository.findOne({
      where: {
        userId: user.id,
        code,
        isUsed: false
      },
      order: {
        createdAt: 'DESC'
      }
    });

    if (!tempCode) {
      throw new BadRequestException('Invalid or expired temporary code');
    }

    // Check if code is expired
    if (new Date() > tempCode.expiresAt) {
      throw new BadRequestException('Temporary code has expired. Please request a new one.');
    }

    // Check attempts limit (max 5 attempts)
    if (tempCode.attempts >= 5) {
      throw new BadRequestException('Too many attempts. Please request a new code.');
    }

    // Increment attempts
    tempCode.attempts += 1;

    // Verify code
    if (tempCode.code !== code) {
      await this.tempCodeRepository.save(tempCode);
      throw new BadRequestException('Invalid temporary code');
    }

    // Mark code as used
    tempCode.isUsed = true;
    tempCode.usedAt = new Date();
    await this.tempCodeRepository.save(tempCode);

    // Track trusted device if fingerprint provided
    if (deviceFingerprint) {
      await this.updateTrustedDevice(user.id, deviceFingerprint);
    }

    // Generate JWT token
    const payload = { 
      email: user.email, 
      sub: user.id,
      username: user.username 
    };

    const { password, ...userWithoutPassword } = user;

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: userWithoutPassword,
      expires_in: '7d',
      message: 'Login successful'
    };
  }

  async resendTempCode(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check for recent codes (prevent spam)
    const recentCode = await this.tempCodeRepository.findOne({
      where: {
        userId: user.id,
        isUsed: false
      },
      order: {
        createdAt: 'DESC'
      }
    });

    if (recentCode) {
      const timeSinceCreation = Date.now() - recentCode.createdAt.getTime();
      const oneMinute = 60 * 1000;
      
      if (timeSinceCreation < oneMinute) {
        throw new BadRequestException('Please wait before requesting a new code');
      }
    }

    // Send new code (reuse the same reason or default to NEW_DEVICE)
    const reason = recentCode?.reason || TempCodeReason.NEW_DEVICE;
    return this.sendTempCode(email, reason);
  }

  private async updateTrustedDevice(userId: string, deviceFingerprint: string) {
    const existingDevice = await this.trustedDeviceRepository.findOne({
      where: {
        userId,
        deviceFingerprint
      }
    });

    if (existingDevice) {
      // Update last used timestamp
      existingDevice.lastUsedAt = new Date();
      await this.trustedDeviceRepository.save(existingDevice);
    } else {
      // Create new trusted device
      const trustedDevice = this.trustedDeviceRepository.create({
        userId,
        deviceFingerprint,
        lastUsedAt: new Date(),
        isActive: true
      });
      await this.trustedDeviceRepository.save(trustedDevice);
    }
  }

  // Clean up expired temp codes (can be called by a cron job)
  async cleanupExpiredCodes() {
    const now = new Date();
    await this.tempCodeRepository.delete({
      expiresAt: LessThan(now),
      isUsed: true
    });
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
