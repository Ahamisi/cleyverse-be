import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum FileStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  FAILED = 'failed',
  DELETED = 'deleted',
}

@Entity('user_files')
@Index(['userId', 'status'])
@Index(['userId', 'folder'])
@Index(['key'], { unique: true })
export class UserFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, user => user.files, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 500, unique: true })
  key: string; // S3 key

  @Column({ type: 'varchar', length: 255 })
  originalName: string; // Original filename

  @Column({ type: 'varchar', length: 255 })
  fileName: string; // Generated filename

  @Column({ type: 'bigint' })
  size: number; // File size in bytes

  @Column({ type: 'varchar', length: 100 })
  contentType: string; // MIME type

  @Column({ type: 'varchar', length: 100 })
  folder: string; // S3 folder

  @Column({ type: 'varchar', length: 20 })
  extension: string; // File extension

  @Column({ type: 'enum', enum: FileStatus, default: FileStatus.ACTIVE })
  status: FileStatus;

  @Column({ type: 'varchar', length: 64, nullable: true })
  etag: string | null; // S3 ETag

  @Column({ type: 'varchar', length: 500, nullable: true })
  url: string | null; // Public URL (if applicable)

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null; // Additional metadata

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @CreateDateColumn()
  uploadedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
