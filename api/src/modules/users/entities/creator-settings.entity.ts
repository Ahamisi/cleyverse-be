import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum NotificationPreference {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  NONE = 'none'
}

export enum PayoutFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  MANUAL = 'manual'
}

export enum ThemePreference {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto'
}

export enum LanguagePreference {
  EN = 'en',
  ES = 'es',
  FR = 'fr',
  DE = 'de',
  IT = 'it',
  PT = 'pt',
  ZH = 'zh',
  JA = 'ja',
  KO = 'ko',
  AR = 'ar'
}

@Entity('creator_settings')
export class CreatorSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // General Settings
  @Column({ type: 'enum', enum: ThemePreference, default: ThemePreference.AUTO })
  theme: ThemePreference;

  @Column({ type: 'enum', enum: LanguagePreference, default: LanguagePreference.EN })
  language: LanguagePreference;

  @Column({ type: 'boolean', default: true })
  emailNotifications: boolean;

  @Column({ type: 'boolean', default: true })
  smsNotifications: boolean;

  @Column({ type: 'boolean', default: true })
  pushNotifications: boolean;

  @Column({ type: 'boolean', default: false })
  marketingEmails: boolean;

  @Column({ type: 'boolean', default: true })
  publicProfile: boolean;

  @Column({ type: 'boolean', default: false })
  showEmail: boolean;

  @Column({ type: 'boolean', default: true })
  showPhone: boolean;

  @Column({ type: 'boolean', default: true })
  allowMessages: boolean;

  @Column({ type: 'boolean', default: true })
  allowComments: boolean;

  // Payout Settings
  @Column({ type: 'enum', enum: PayoutFrequency, default: PayoutFrequency.WEEKLY })
  payoutFrequency: PayoutFrequency;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 50.00 })
  minimumPayoutThreshold: number;

  @Column({ type: 'boolean', default: true })
  autoPayout: boolean;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  preferredCurrency: string;

  @Column({ type: 'varchar', length: 2, default: 'US' })
  taxCountry: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  taxId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  businessName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  businessAddress: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  businessCity: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  businessState: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  businessZipCode: string;

  // Additional Settings
  @Column({ type: 'json', nullable: true })
  customSettings: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  socialLinks: string; // JSON string of social media links

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
