import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PaymentStatus, PlatformType } from '../../../config/payment.config';

// Re-export the enums for use in other files
export { PaymentStatus, PlatformType };

@Entity('invoices')
@Index(['creatorId', 'status'])
@Index(['paymentLink'])
@Index(['expiresAt'])
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  creatorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 3 })
  currency: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 500, unique: true })
  paymentLink: string;

  @Column({ type: 'text', nullable: true })
  qrCode: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'enum', enum: PlatformType })
  platform: PlatformType;

  @Column({ type: 'json', nullable: true })
  customerInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: {
      lat: number;
      lng: number;
    };
  };

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  fraudScore: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  riskLevel: string; // low, medium, high

  @Column({ type: 'json', nullable: true })
  paymentData: Record<string, any>;

  @Column({ type: 'uuid', nullable: true })
  paymentId: string; // Reference to the actual payment

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
