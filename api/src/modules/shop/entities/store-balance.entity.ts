import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Store } from './store.entity';

export enum BalanceType {
  AVAILABLE = 'available',
  PENDING = 'pending',
  HELD = 'held',
  PROCESSING = 'processing'
}

export enum TransactionType {
  EARNING = 'earning',
  PAYOUT = 'payout',
  REFUND = 'refund',
  ADJUSTMENT = 'adjustment',
  FEE = 'fee'
}

@Entity('store_balances')
@Index(['storeId', 'type'])
@Index(['storeId', 'createdAt'])
export class StoreBalance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column({ type: 'enum', enum: BalanceType })
  type: BalanceType;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({ length: 3, default: 'USD' })
  currency: string;

  @Column({ type: 'enum', enum: TransactionType })
  transactionType: TransactionType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true })
  paymentId: string;

  @Column({ type: 'uuid', nullable: true })
  orderId: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
