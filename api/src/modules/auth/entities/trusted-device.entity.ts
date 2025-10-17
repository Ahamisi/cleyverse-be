import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('trusted_devices')
export class TrustedDevice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'device_fingerprint', type: 'varchar', unique: false })
  deviceFingerprint: string;

  @Column({ name: 'device_name', type: 'varchar', nullable: true })
  deviceName: string | null;

  @Column({ name: 'device_type', type: 'varchar', nullable: true })
  deviceType: string | null; // 'mobile', 'desktop', 'tablet'

  @Column({ name: 'browser', type: 'varchar', nullable: true })
  browser: string | null;

  @Column({ name: 'os', type: 'varchar', nullable: true })
  os: string | null;

  @Column({ name: 'ip_address', type: 'varchar', nullable: true })
  ipAddress: string | null;

  @Column({ name: 'last_used_at', type: 'timestamp' })
  lastUsedAt: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}

