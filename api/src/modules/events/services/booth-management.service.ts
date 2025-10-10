import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventBooth, BoothStatus, BoothType } from '../entities/event-booth.entity';
import { Event } from '../entities/event.entity';

export class CreateBoothDto {
  boothNumber: string;
  boothType: BoothType;
  section?: string;
  floor?: string;
  sizeWidth?: number;
  sizeLength?: number;
  sizeDescription?: string;
  basePrice: number;
  premiumMultiplier?: number;
  hasPower?: boolean;
  powerOutlets?: number;
  hasWifi?: boolean;
  hasStorage?: boolean;
  hasSink?: boolean;
  maxOccupancy?: number;
  description?: string;
  specialRequirements?: string;
  accessibilityFeatures?: string[];
}

export class BulkCreateBoothsDto {
  template: {
    boothType: BoothType;
    section?: string;
    floor?: string;
    sizeWidth?: number;
    sizeLength?: number;
    sizeDescription?: string;
    basePrice: number;
    premiumMultiplier?: number;
    hasPower?: boolean;
    powerOutlets?: number;
    hasWifi?: boolean;
    hasStorage?: boolean;
    hasSink?: boolean;
    maxOccupancy?: number;
    description?: string;
  };
  boothNumbers: string[]; // ["A-1", "A-2", "A-3"] or auto-generate
  autoGenerate?: {
    prefix: string; // "A-", "B-", "TECH-"
    startNumber: number; // 1
    count: number; // 20
  };
}

@Injectable()
export class BoothManagementService {
  constructor(
    @InjectRepository(EventBooth)
    private boothRepository: Repository<EventBooth>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async createBooth(userId: string, eventId: string, createBoothDto: CreateBoothDto): Promise<EventBooth> {
    // Verify event ownership
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    // Check if booth number already exists for this event
    const existingBooth = await this.boothRepository.findOne({
      where: { eventId, boothNumber: createBoothDto.boothNumber }
    });

    if (existingBooth) {
      throw new ConflictException(`Booth number ${createBoothDto.boothNumber} already exists for this event`);
    }

    const booth = this.boothRepository.create({
      eventId,
      ...createBoothDto,
      status: BoothStatus.AVAILABLE
    });

    return this.boothRepository.save(booth) as unknown as EventBooth;
  }

  async bulkCreateBooths(userId: string, eventId: string, bulkCreateDto: BulkCreateBoothsDto): Promise<EventBooth[]> {
    // Verify event ownership
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    let boothNumbers: string[] = [];

    if (bulkCreateDto.autoGenerate) {
      const { prefix, startNumber, count } = bulkCreateDto.autoGenerate;
      for (let i = 0; i < count; i++) {
        boothNumbers.push(`${prefix}${startNumber + i}`);
      }
    } else {
      boothNumbers = bulkCreateDto.boothNumbers;
    }

    // Check for existing booth numbers
    const existingBooths = await this.boothRepository.find({
      where: { eventId },
      select: ['boothNumber']
    });
    const existingNumbers = existingBooths.map(b => b.boothNumber);
    const duplicates = boothNumbers.filter(num => existingNumbers.includes(num));

    if (duplicates.length > 0) {
      throw new ConflictException(`Booth numbers already exist: ${duplicates.join(', ')}`);
    }

    // Create booths
    const booths = boothNumbers.map(boothNumber => 
      this.boothRepository.create({
        eventId,
        boothNumber,
        status: BoothStatus.AVAILABLE,
        ...bulkCreateDto.template
      })
    );

    return this.boothRepository.save(booths) as unknown as EventBooth[];
  }

  async getEventBooths(userId: string, eventId: string): Promise<EventBooth[]> {
    // Verify event ownership or host access
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    return this.boothRepository.find({
      where: { eventId },
      relations: ['vendor'],
      order: { boothNumber: 'ASC' }
    });
  }

  async getAvailableBooths(userId: string, eventId: string): Promise<EventBooth[]> {
    // Verify event ownership
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    return this.boothRepository.find({
      where: { eventId, status: BoothStatus.AVAILABLE },
      order: { boothNumber: 'ASC' }
    });
  }

  async assignBoothToVendor(userId: string, eventId: string, boothId: string, vendorId: string): Promise<EventBooth> {
    // Verify event ownership
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    const booth = await this.boothRepository.findOne({
      where: { id: boothId, eventId }
    });

    if (!booth) {
      throw new NotFoundException('Booth not found');
    }

    if (booth.status !== BoothStatus.AVAILABLE) {
      throw new BadRequestException('Booth is not available for assignment');
    }

    booth.vendorId = vendorId;
    booth.status = BoothStatus.RESERVED;

    return this.boothRepository.save(booth) as unknown as EventBooth;
  }

  async generateBoothSuggestion(eventId: string, vendorRequirements?: {
    preferredSection?: string;
    needsPower?: boolean;
    needsWifi?: boolean;
    needsStorage?: boolean;
    needsSink?: boolean;
    minSize?: number;
    maxPrice?: number;
  }): Promise<EventBooth[]> {
    let query = this.boothRepository.createQueryBuilder('booth')
      .where('booth.eventId = :eventId', { eventId })
      .andWhere('booth.status = :status', { status: BoothStatus.AVAILABLE });

    if (vendorRequirements) {
      if (vendorRequirements.preferredSection) {
        query = query.andWhere('booth.section = :section', { section: vendorRequirements.preferredSection });
      }
      if (vendorRequirements.needsPower) {
        query = query.andWhere('booth.hasPower = true');
      }
      if (vendorRequirements.needsWifi) {
        query = query.andWhere('booth.hasWifi = true');
      }
      if (vendorRequirements.needsStorage) {
        query = query.andWhere('booth.hasStorage = true');
      }
      if (vendorRequirements.needsSink) {
        query = query.andWhere('booth.hasSink = true');
      }
      if (vendorRequirements.maxPrice) {
        query = query.andWhere('booth.basePrice * booth.premiumMultiplier <= :maxPrice', { maxPrice: vendorRequirements.maxPrice });
      }
    }

    return query
      .orderBy('booth.basePrice * booth.premiumMultiplier', 'ASC') // Cheapest first
      .addOrderBy('booth.boothNumber', 'ASC')
      .limit(10)
      .getMany();
  }

  async getBoothAnalytics(userId: string, eventId: string): Promise<any> {
    // Verify event ownership
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    const booths = await this.boothRepository.find({
      where: { eventId }
    });

    const analytics = {
      total: booths.length,
      available: booths.filter(b => b.status === BoothStatus.AVAILABLE).length,
      reserved: booths.filter(b => b.status === BoothStatus.RESERVED).length,
      occupied: booths.filter(b => b.status === BoothStatus.OCCUPIED).length,
      maintenance: booths.filter(b => b.status === BoothStatus.MAINTENANCE).length,
      occupancyRate: booths.length > 0 ? ((booths.length - booths.filter(b => b.status === BoothStatus.AVAILABLE).length) / booths.length * 100).toFixed(2) : '0.00',
      totalRevenue: booths
        .filter(b => b.status !== BoothStatus.AVAILABLE)
        .reduce((sum, b) => sum + (b.basePrice * b.premiumMultiplier), 0),
      averagePrice: booths.length > 0 ? (booths.reduce((sum, b) => sum + (b.basePrice * b.premiumMultiplier), 0) / booths.length).toFixed(2) : '0.00',
      byType: {
        standard: booths.filter(b => b.boothType === BoothType.STANDARD).length,
        premium: booths.filter(b => b.boothType === BoothType.PREMIUM).length,
        corner: booths.filter(b => b.boothType === BoothType.CORNER).length,
        island: booths.filter(b => b.boothType === BoothType.ISLAND).length,
        food: booths.filter(b => b.boothType === BoothType.FOOD).length,
        tech: booths.filter(b => b.boothType === BoothType.TECH).length,
      }
    };

    return analytics;
  }
}
