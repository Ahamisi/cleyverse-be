import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum BusinessType {
  JUST_STARTING = 'just_starting',
  ALREADY_SELLING = 'already_selling'
}

export enum SalesChannel {
  ONLINE_STORE = 'online_store',
  SOCIAL_MEDIA = 'social_media',
  IN_PERSON = 'in_person',
  MARKETPLACES = 'marketplaces',
  EXISTING_WEBSITE = 'existing_website',
  NOT_SURE = 'not_sure'
}

export enum ProductType {
  PHYSICAL_PRODUCTS = 'physical_products',
  DIGITAL_PRODUCTS = 'digital_products',
  SERVICES = 'services',
  DROPSHIPPING = 'dropshipping',
  PRINT_ON_DEMAND = 'print_on_demand',
  DECIDE_LATER = 'decide_later'
}

export enum OnboardingStep {
  WELCOME = 'welcome',
  BUSINESS_TYPE = 'business_type',
  SALES_CHANNELS = 'sales_channels',
  PRODUCT_TYPE = 'product_type',
  STORE_SETUP = 'store_setup',
  COMPLETED = 'completed'
}

@Entity('store_onboarding')
export class StoreOnboarding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ 
    type: 'enum', 
    enum: OnboardingStep, 
    default: OnboardingStep.WELCOME 
  })
  currentStep: OnboardingStep;

  @Column({ 
    type: 'enum', 
    enum: BusinessType, 
    nullable: true 
  })
  businessType: BusinessType | null;

  @Column({ 
    type: 'simple-array', 
    nullable: true 
  })
  salesChannels: SalesChannel[] | null;

  @Column({ 
    type: 'simple-array', 
    nullable: true 
  })
  productTypes: ProductType[] | null;

  // Store setup data (will be used to create the actual store)
  @Column({ type: 'varchar', nullable: true })
  storeName: string | null;

  @Column({ type: 'varchar', nullable: true })
  storeUrl: string | null;

  @Column({ type: 'text', nullable: true })
  storeDescription: string | null;

  @Column({ type: 'varchar', nullable: true })
  currency: string | null;

  @Column({ type: 'varchar', nullable: true })
  logoUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  bannerUrl: string | null;

  @Column({ default: false })
  isCompleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
