import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';
import { User } from './user.entity';

@Entity('email_verifications')
export class EmailVerification extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ unique: true })
  token: string;

  @Column({ 
    name: 'expires_at', 
    type: 'timestamp', 
    default: () => `NOW() + INTERVAL '24 hours'` 
  })
  expiresAt: Date;

  @Column({ name: 'is_used', default: false })
  isUsed: boolean;
}
