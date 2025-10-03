import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';

export enum UserCategory {
  BUSINESS = 'business',
  CREATIVE = 'creative',
  EDUCATION = 'education',
  ENTERTAINMENT = 'entertainment',
  FASHION_BEAUTY = 'fashion_beauty',
  FOOD_BEVERAGE = 'food_beverage',
  GOVERNMENT_POLITICS = 'government_politics',
  HEALTH_WELLNESS = 'health_wellness',
  NON_PROFIT = 'non_profit',
  OTHER = 'other',
  TECH = 'tech',
  TRAVEL_TOURISM = 'travel_tourism'
}

export enum UserGoal {
  CREATOR = 'creator',
  BUSINESS = 'business',
  PERSONAL = 'personal'
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  // Personal Information
  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  // Onboarding Information
  @Column({ 
    type: 'enum', 
    enum: UserCategory, 
    nullable: true 
  })
  category: UserCategory;

  @Column({ 
    type: 'enum', 
    enum: UserGoal, 
    nullable: true 
  })
  goal: UserGoal;

  // Profile Information
  @Column({ name: 'profile_title', nullable: true })
  profileTitle: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ name: 'profile_image_url', nullable: true })
  profileImageUrl: string;

  // Onboarding Progress
  @Column({ name: 'has_completed_onboarding', default: false })
  hasCompletedOnboarding: boolean;

  @Column({ name: 'onboarding_step', default: 1 })
  onboardingStep: number;

  // Email Verification
  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'email_verified_at', nullable: true })
  emailVerifiedAt: Date;

  // Relationships
  @OneToMany('Link', 'user')
  links: any[];

  @OneToMany('SocialLink', 'user')
  socialLinks: any[];

  @OneToMany('Collection', 'user')
  collections: any[];

  @OneToMany('Form', 'user')
  forms: any[];
}
