import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';

export enum PayoutMethod {
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  STRIPE_CONNECT = 'stripe_connect',
  WISE = 'wise',
  CRYPTO = 'crypto'
}

export enum BankAccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  BUSINESS = 'business'
}

export enum PayoutStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended'
}

@Entity('creator_payout_settings')
@Index(['userId', 'isDefault'])
export class CreatorPayoutSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: PayoutMethod })
  method: PayoutMethod;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ type: 'enum', enum: PayoutStatus, default: PayoutStatus.PENDING })
  status: PayoutStatus;

  // Bank Transfer Details
  @Column({ type: 'varchar', length: 100, nullable: true })
  bankName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  accountNumber: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  routingNumber: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  swiftCode: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  iban: string;

  @Column({ type: 'enum', enum: BankAccountType, nullable: true })
  accountType: BankAccountType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  accountHolderName: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  zipCode: string;

  // PayPal Details
  @Column({ type: 'varchar', length: 255, nullable: true })
  paypalEmail: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  paypalMerchantId: string;

  // Stripe Connect Details
  @Column({ type: 'varchar', length: 100, nullable: true })
  stripeAccountId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  stripeConnectId: string;

  // Wise (formerly TransferWise) Details
  @Column({ type: 'varchar', length: 100, nullable: true })
  wiseAccountId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  wiseEmail: string;

  // Crypto Details
  @Column({ type: 'varchar', length: 50, nullable: true })
  cryptoCurrency: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cryptoAddress: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cryptoNetwork: string;

  // Verification Details
  @Column({ type: 'varchar', length: 255, nullable: true })
  verificationDocument: string;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  verificationNotes: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  verifiedBy: string;

  // Additional Metadata
  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  externalId: string; // ID from payment processor

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
