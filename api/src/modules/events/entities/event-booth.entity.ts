import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum BoothStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance'
}

export enum BoothType {
  STANDARD = 'standard',
  PREMIUM = 'premium',
  CORNER = 'corner',
  ISLAND = 'island',
  FOOD = 'food',
  TECH = 'tech'
}

@Entity('event_booths')
export class EventBooth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // Relations
  @Column({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @Column({ name: 'vendor_id', type: 'uuid', nullable: true })
  vendorId: string | null;

  // Booth Details
  @Column({ name: 'booth_number', type: 'varchar', length: 20 })
  boothNumber: string;

  @Column({ name: 'booth_type', type: 'enum', enum: BoothType })
  boothType: BoothType;

  @Column({ name: 'status', type: 'enum', enum: BoothStatus, default: BoothStatus.AVAILABLE })
  status: BoothStatus;

  // Location & Layout
  @Column({ name: 'section', type: 'varchar', length: 50, nullable: true })
  section: string | null; // e.g., "Main Hall", "Tech Zone", "Food Court"

  @Column({ name: 'floor', type: 'varchar', length: 20, nullable: true })
  floor: string | null; // e.g., "Ground Floor", "Level 2"

  @Column({ name: 'position_x', type: 'int', nullable: true })
  positionX: number | null; // For floor plan mapping

  @Column({ name: 'position_y', type: 'int', nullable: true })
  positionY: number | null; // For floor plan mapping

  // Specifications
  @Column({ name: 'size_width', type: 'decimal', precision: 5, scale: 2, nullable: true })
  sizeWidth: number | null; // in meters

  @Column({ name: 'size_length', type: 'decimal', precision: 5, scale: 2, nullable: true })
  sizeLength: number | null; // in meters

  @Column({ name: 'size_description', type: 'varchar', length: 50, nullable: true })
  sizeDescription: string | null; // e.g., "3x3", "6x4"

  // Pricing
  @Column({ name: 'base_price', type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ name: 'premium_multiplier', type: 'decimal', precision: 3, scale: 2, default: 1.0 })
  premiumMultiplier: number; // 1.0 = standard, 1.5 = 50% premium

  // Features & Amenities
  @Column({ name: 'has_power', type: 'boolean', default: true })
  hasPower: boolean;

  @Column({ name: 'power_outlets', type: 'int', default: 2 })
  powerOutlets: number;

  @Column({ name: 'has_wifi', type: 'boolean', default: true })
  hasWifi: boolean;

  @Column({ name: 'has_storage', type: 'boolean', default: false })
  hasStorage: boolean;

  @Column({ name: 'has_sink', type: 'boolean', default: false })
  hasSink: boolean; // For food booths

  @Column({ name: 'max_occupancy', type: 'int', default: 4 })
  maxOccupancy: number;

  // Setup & Breakdown
  @Column({ name: 'setup_time', type: 'timestamp', nullable: true })
  setupTime: Date | null;

  @Column({ name: 'breakdown_time', type: 'timestamp', nullable: true })
  breakdownTime: Date | null;

  // Additional Info
  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'special_requirements', type: 'text', nullable: true })
  specialRequirements: string | null;

  @Column({ name: 'accessibility_features', type: 'text', array: true, nullable: true })
  accessibilityFeatures: string[] | null; // ["wheelchair_accessible", "hearing_loop"]
}
