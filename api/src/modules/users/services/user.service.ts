import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../common/base/base.service';
import { User, UserCategory, UserGoal } from '../entities/user.entity';
import { EmailVerification } from '../entities/email-verification.entity';
import { EmailService } from '../../../shared/services/email.service';
import * as bcrypt from 'bcrypt';
import { 
  CreateUserDto, 
  UpdatePersonalInfoDto, 
  UpdateGoalDto, 
  UpdateUsernameDto, 
  UpdateProfileDto,
  CompleteOnboardingDto 
} from '../dto/create-user.dto';
import * as crypto from 'crypto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,
    private readonly emailService: EmailService,
  ) {
    super(userRepository);
  }

  protected getEntityName(): string {
    return 'User';
  }

  async register(createUserDto: CreateUserDto) {
    // Check if email or username already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }, { username: createUserDto.username }]
    });

    if (existingUser) {
      throw new BadRequestException('Email or username already exists');
    }

    // Hash password and create user
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const user = await this.create({
      ...createUserDto,
      password: hashedPassword,
      isEmailVerified: false
    });

    // Generate verification token
    await this.createEmailVerification(user.id);

    return this.excludeFields(user, ['password']);
  }

  async updatePersonalInfo(userId: string, personalInfo: UpdatePersonalInfoDto) {
    const user = await this.findById(userId);
    
    // Only update provided fields
    const updateData: any = {
      onboardingStep: Math.max(user.onboardingStep, 2)
    };

    if (personalInfo?.firstName !== undefined) {
      updateData.firstName = personalInfo.firstName;
    }
    
    if (personalInfo?.lastName !== undefined) {
      updateData.lastName = personalInfo.lastName;
    }
    
    if (personalInfo?.category !== undefined) {
      updateData.category = personalInfo.category;
    }

    const updatedUser = await this.update(userId, updateData);
    return this.excludeFields(updatedUser, ['password']);
  }

  async updateUsername(userId: string, username: string) {
    if (!username) {
      throw new BadRequestException('Username is required');
    }

    const user = await this.findById(userId);

    // Check if username is available (excluding current user)
    const existingUser = await this.userRepository.findOne({ where: { username } });
    
    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestException('Username is already taken');
    }

    const updatedUser = await this.update(userId, {
      username,
      onboardingStep: Math.max(user.onboardingStep, 3)
    });

    return this.excludeFields(updatedUser, ['password']);
  }

  async updateGoal(userId: string, goal: UserGoal) {
    if (!goal) {
      throw new BadRequestException('Goal is required');
    }

    const user = await this.findById(userId);

    const updatedUser = await this.update(userId, {
      goal,
      onboardingStep: Math.max(user.onboardingStep, 4)
    });

    return this.excludeFields(updatedUser, ['password']);
  }

  async updateProfile(userId: string, profileData: UpdateProfileDto) {
    const user = await this.findById(userId);

    const updatedUser = await this.update(userId, {
      ...profileData,
      onboardingStep: Math.max(user.onboardingStep, 5)
    });

    return this.excludeFields(updatedUser, ['password']);
  }

  async completeOnboarding(userId: string, finalData: CompleteOnboardingDto) {
    const user = await this.findById(userId);

    if (!user.isEmailVerified) {
      throw new BadRequestException('Please verify your email before completing onboarding');
    }

    const updatedUser = await this.update(userId, {
      ...finalData,
      hasCompletedOnboarding: true,
      onboardingStep: 6
    });

    return this.excludeFields(updatedUser, ['password']);
  }

  async getOnboardingStatus(userId: string) {
    const user = await this.findById(userId);
    const userResult = this.excludeFields(user, ['password']);
    
    return {
      user: userResult,
      onboardingStep: user.onboardingStep,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
      isEmailVerified: user.isEmailVerified,
      nextSteps: this.getNextSteps(user.onboardingStep, user.isEmailVerified)
    };
  }

  async checkUsernameAvailability(username: string) {
    const existingUser = await this.userRepository.findOne({ where: { username } });
    
    return {
      available: !existingUser,
      username,
      message: existingUser ? 'Username is already taken' : 'Username is available'
    };
  }

  getCategories() {
    return Object.values(UserCategory).map(category => ({
      value: category,
      label: this.formatCategoryLabel(category)
    }));
  }

  getGoals() {
    return [
      {
        value: UserGoal.CREATOR,
        label: 'Creator',
        description: 'Build my following and explore ways to monetize my audience.'
      },
      {
        value: UserGoal.BUSINESS,
        label: 'Business',
        description: 'Grow my business and reach more customers.'
      },
      {
        value: UserGoal.PERSONAL,
        label: 'Personal',
        description: 'Share links with my friends and acquaintances.'
      }
    ];
  }

  private async createEmailVerification(userId: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const verification = this.emailVerificationRepository.create({
      userId,
      token,
    });
    await this.emailVerificationRepository.save(verification);

    const user = await this.findById(userId);
    await this.emailService.sendVerificationEmail(user.email, token);
  }

  private getNextSteps(currentStep: number, isEmailVerified: boolean): string[] {
    const steps: string[] = [];
    
    if (!isEmailVerified) steps.push('verify-email');
    if (currentStep < 2) steps.push('personal-info');
    if (currentStep < 3) steps.push('username');
    if (currentStep < 4) steps.push('goal');
    if (currentStep < 5) steps.push('platforms');
    if (currentStep < 6) steps.push('profile');
    
    return steps;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private formatCategoryLabel(category: UserCategory): string {
    const labels = {
      [UserCategory.BUSINESS]: 'Business',
      [UserCategory.CREATIVE]: 'Creative',
      [UserCategory.EDUCATION]: 'Education',
      [UserCategory.ENTERTAINMENT]: 'Entertainment',
      [UserCategory.FASHION_BEAUTY]: 'Fashion & Beauty',
      [UserCategory.FOOD_BEVERAGE]: 'Food & Beverage',
      [UserCategory.GOVERNMENT_POLITICS]: 'Government & Politics',
      [UserCategory.HEALTH_WELLNESS]: 'Health & Wellness',
      [UserCategory.NON_PROFIT]: 'Non-Profit',
      [UserCategory.OTHER]: 'Other',
      [UserCategory.TECH]: 'Tech',
      [UserCategory.TRAVEL_TOURISM]: 'Travel & Tourism'
    };
    
    return labels[category] || category;
  }

}
