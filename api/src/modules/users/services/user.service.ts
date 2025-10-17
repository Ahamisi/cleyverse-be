import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../common/base/base.service';
import { User, UserCategory, UserGoal } from '../entities/user.entity';
import { EmailVerification } from '../entities/email-verification.entity';
import { EmailVerificationService } from './email-verification.service';
import { EmailService } from '../../../shared/services/email.service';
import { Link } from '../../links/entities/link.entity';
import { SocialLink } from '../../links/entities/social-link.entity';
import { Collection } from '../../collections/entities/collection.entity';
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
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
    @InjectRepository(SocialLink)
    private readonly socialLinkRepository: Repository<SocialLink>,
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    private readonly emailService: EmailService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {
    super(userRepository);
  }

  protected getEntityName(): string {
    return 'User';
  }

  async register(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto;

    // Validate required fields
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    
    if (!username) {
      throw new BadRequestException('Username is required');
    }

    // Check if email or username already exists
    const existingUserByEmail = await this.userRepository.findOne({
      where: { email }
    });

    if (existingUserByEmail) {
      if (existingUserByEmail.password) {
        throw new BadRequestException(
          'An account with this email already exists. Please login to continue.'
        );
      } else {
        throw new BadRequestException(
          'An account with this email already exists. Please check your email to verify your account and set up your password.'
        );
      }
    }

    const existingUserByUsername = await this.userRepository.findOne({
      where: { username }
    });

    if (existingUserByUsername) {
      throw new BadRequestException(
        'This username is already taken. Please choose a different username.'
      );
    }

    // Create user with or without password
    let userData: any = {
      email,
      username,
      isEmailVerified: false,
      // User provided username during registration, so they're past step 2
      // Step 1: Email provided ✓
      // Step 2: Username provided ✓
      // Ready for Step 3: Personal Info
      onboardingStep: 2
    };

    // Only hash password if provided
    if (password) {
      userData.password = await this.hashPassword(password);
    } else {
      userData.password = null; // Allow null password for passwordless registration
    }

    const user = await this.create(userData);

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

    // Allow onboarding completion without email verification
    // Users can verify email anytime after onboarding

    const updatedUser = await this.update(userId, {
      ...finalData,
      hasCompletedOnboarding: true,
      onboardingStep: 4 // Step 4 is the final step (matches frontend "4 of 4")
    });

    return this.excludeFields(updatedUser, ['password']);
  }

  async getOnboardingStatus(userId: string) {
    const user = await this.findById(userId);
    const userResult = this.excludeFields(user, ['password']);
    
    // Calculate smart onboarding step based on actual data
    const smartOnboardingStep = this.calculateOnboardingStep(user);
    
    return {
      user: userResult,
      onboardingStep: smartOnboardingStep,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
      isEmailVerified: user.isEmailVerified,
      nextSteps: this.getNextSteps(user, user.isEmailVerified)
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

  /**
   * Calculate smart onboarding step based on actual user data
   * Matches frontend flow: 4 steps total (frontend shows 4/4 on final step)
   */
  private calculateOnboardingStep(user: User): number {
    let step = 1;
    
    // Step 1: Email + Username (Registration) - Always completed if user exists
    step = 1;
    
    // Step 2: Personal info completed (firstName, lastName)
    if (user.firstName && user.lastName) {
      step = 2;
    }
    
    // Step 3: Category selected
    if (user.category) {
      step = 3;
    }
    
    // Step 4: Goal selected
    if (user.goal) {
      step = 4;
    }
    
    // Profile completion (profileTitle, bio, profileImage) is part of step 4
    // Frontend shows "Step 4 of 4" on profile details page
    
    return step;
  }

  /**
   * Get next steps based on actual user data
   * Matches frontend flow: 4 steps total
   * Email verification is optional and can be done anytime
   */
  private getNextSteps(user: User, isEmailVerified: boolean): string[] {
    const steps: string[] = [];
    
    // Email verification is optional - users can verify anytime
    if (!isEmailVerified) {
      steps.push('verify-email');
    }
    
    // Step 2: Personal info (firstName, lastName)
    if (!user.firstName || !user.lastName) {
      steps.push('personal-info');
    }
    
    // Step 3: Category selection
    if (!user.category) {
      steps.push('category');
    }
    
    // Step 4: Goal selection + Profile completion
    if (!user.goal) {
      steps.push('goal');
    }
    
    // Profile completion (profileTitle, bio, profileImage) is part of step 4
    if (!user.profileTitle || !user.bio || (!user.profileImageUrl && !user.profileImageGradient)) {
      steps.push('profile');
    }
    
    return steps;
  }

  async setupPassword(userId: string, password: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password) {
      throw new BadRequestException('Password already set for this user. Use the update password endpoint instead.');
    }

    const hashedPassword = await this.hashPassword(password);
    await this.userRepository.update(userId, { password: hashedPassword });

    return this.findById(userId);
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.password) {
      throw new BadRequestException('Please set up your password first');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Check that new password is different from current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    const hashedPassword = await this.hashPassword(newPassword);
    await this.userRepository.update(userId, { password: hashedPassword });

    return this.findById(userId);
  }

  async verifyEmailAndSetupPassword(token: string, password: string): Promise<User> {
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

    // Update user email verification status
    await this.userRepository.update(verification.userId, {
      isEmailVerified: true,
      emailVerifiedAt: new Date()
    });

    // Mark verification as used
    await this.emailVerificationRepository.update(verification.id, {
      isUsed: true
    });

    // Setup password
    return this.setupPassword(verification.userId, password);
  }

  private async hashPassword(password: string): Promise<string> {
    if (!password) {
      throw new BadRequestException('Password is required');
    }
    
    if (typeof password !== 'string') {
      throw new BadRequestException('Password must be a string');
    }
    
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async getPublicProfile(username: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { username },
        select: [
          'id', 'username', 'firstName', 'lastName', 'profileTitle', 'bio',
          'profileImageUrl', 'profileImageGradient', 'category', 'goal', 'createdAt'
        ]
      });

      if (!user) {
        // Return empty data structure for SSR compatibility instead of 404
        return {
          message: 'User not found',
          user: null,
          links: [],
          socialLinks: [],
          collections: [],
          exists: false
        };
      }

      // Get user's links
      const links = await this.linkRepository.find({
        where: { userId: user.id, isActive: true },
        order: { displayOrder: 'ASC' },
        select: [
          'id', 'title', 'url', 'type', 'layout', 'isActive', 'displayOrder',
          'clickCount', 'createdAt'
        ]
      });

      // Get user's social links
      const socialLinks = await this.socialLinkRepository.find({
        where: { userId: user.id, isActive: true },
        order: { displayOrder: 'ASC' },
        select: [
          'id', 'platform', 'url', 'username', 'isActive', 'displayOrder',
          'clickCount', 'createdAt'
        ]
      });

      // Get user's collections
      const collections = await this.collectionRepository.find({
        where: { userId: user.id, isActive: true },
        order: { displayOrder: 'ASC' },
        select: [
          'id', 'title', 'description', 'layout', 'isActive', 'displayOrder',
          'linkCount', 'createdAt'
        ]
      });

      // Get links for each collection
      for (const collection of collections) {
        const collectionLinks = await this.linkRepository
          .createQueryBuilder('link')
          .leftJoin('link.collections', 'collection')
          .where('collection.id = :collectionId', { collectionId: collection.id })
          .andWhere('link.isActive = :isActive', { isActive: true })
          .orderBy('link.displayOrder', 'ASC')
          .select([
            'link.id', 'link.title', 'link.url', 'link.type'
          ])
          .getMany();
        
        (collection as any).links = collectionLinks;
      }

      return {
        message: 'User profile retrieved successfully',
        user: {
          ...user,
          category: user.category ? this.formatCategoryLabel(user.category) : null,
          goal: user.goal ? this.formatGoalLabel(user.goal) : null
        },
        links,
        socialLinks,
        collections,
        exists: true
      };
    } catch (error) {
      console.error('Error in getPublicProfile:', error);
      throw error;
    }
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

  private formatGoalLabel(goal: UserGoal): string {
    const labels = {
      [UserGoal.CREATOR]: 'Creator',
      [UserGoal.BUSINESS]: 'Business',
      [UserGoal.PERSONAL]: 'Personal'
    };
    
    return labels[goal] || goal;
  }

}
