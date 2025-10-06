import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';

export class CreateRecurringEventDto {
  recurrencePattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurrenceInterval: number; // every N days/weeks/months/years
  recurrenceEndDate?: Date;
  maxInstances?: number; // alternative to end date
}

@Injectable()
export class RecurringEventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async createRecurringEvent(userId: string, eventId: string, recurringDto: CreateRecurringEventDto): Promise<Event[]> {
    // Get the parent event
    const parentEvent = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!parentEvent) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    if (parentEvent.isRecurring) {
      throw new BadRequestException('Event is already set as recurring');
    }

    // Update parent event to mark as recurring
    parentEvent.isRecurring = true;
    parentEvent.recurrencePattern = recurringDto.recurrencePattern;
    parentEvent.recurrenceInterval = recurringDto.recurrenceInterval;
    parentEvent.recurrenceEndDate = recurringDto.recurrenceEndDate || null;
    await this.eventRepository.save(parentEvent);

    // Generate recurring instances
    const instances = this.generateRecurringInstances(parentEvent, recurringDto);
    
    // Save all instances
    const savedInstances = await this.eventRepository.save(instances);

    return [parentEvent, ...savedInstances];
  }

  async getRecurringEventInstances(userId: string, parentEventId: string): Promise<Event[]> {
    // Verify parent event belongs to user
    const parentEvent = await this.eventRepository.findOne({
      where: { id: parentEventId, creatorId: userId }
    });

    if (!parentEvent) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    if (!parentEvent.isRecurring) {
      throw new BadRequestException('Event is not a recurring event');
    }

    // Get all instances
    return this.eventRepository.find({
      where: { parentEventId },
      order: { startDate: 'ASC' }
    });
  }

  async updateRecurringEventSeries(userId: string, parentEventId: string, updateData: Partial<Event>): Promise<Event[]> {
    // Get parent event and all instances
    const parentEvent = await this.eventRepository.findOne({
      where: { id: parentEventId, creatorId: userId }
    });

    if (!parentEvent) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    const instances = await this.eventRepository.find({
      where: { parentEventId }
    });

    // Update parent event
    Object.assign(parentEvent, updateData);
    await this.eventRepository.save(parentEvent);

    // Update all future instances (preserve past events)
    const now = new Date();
    const futureInstances = instances.filter(instance => instance.startDate > now);

    for (const instance of futureInstances) {
      // Preserve date-specific fields, update everything else
      const { startDate, endDate, ...restUpdateData } = updateData;
      Object.assign(instance, restUpdateData);
    }

    if (futureInstances.length > 0) {
      await this.eventRepository.save(futureInstances);
    }

    return [parentEvent, ...instances];
  }

  async deleteRecurringEventSeries(userId: string, parentEventId: string, deleteOption: 'all' | 'future'): Promise<void> {
    // Verify parent event belongs to user
    const parentEvent = await this.eventRepository.findOne({
      where: { id: parentEventId, creatorId: userId }
    });

    if (!parentEvent) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    const instances = await this.eventRepository.find({
      where: { parentEventId }
    });

    if (deleteOption === 'all') {
      // Delete all instances and parent
      await this.eventRepository.remove([parentEvent, ...instances]);
    } else {
      // Delete only future instances
      const now = new Date();
      const futureInstances = instances.filter(instance => instance.startDate > now);
      
      if (futureInstances.length > 0) {
        await this.eventRepository.remove(futureInstances);
      }

      // Update parent to stop recurring
      parentEvent.isRecurring = false;
      parentEvent.recurrencePattern = null;
      parentEvent.recurrenceInterval = null;
      parentEvent.recurrenceEndDate = null;
      await this.eventRepository.save(parentEvent);
    }
  }

  async breakRecurringEventInstance(userId: string, instanceEventId: string): Promise<Event> {
    // Get the instance
    const instance = await this.eventRepository.findOne({
      where: { id: instanceEventId, creatorId: userId }
    });

    if (!instance) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    if (!instance.parentEventId) {
      throw new BadRequestException('Event is not part of a recurring series');
    }

    // Break the instance from the series
    instance.parentEventId = null;
    instance.isRecurring = false;
    instance.recurrencePattern = null;
    instance.recurrenceInterval = null;
    instance.recurrenceEndDate = null;

    return this.eventRepository.save(instance);
  }

  private generateRecurringInstances(parentEvent: Event, recurringDto: CreateRecurringEventDto): Event[] {
    const instances: Event[] = [];
    const maxInstances = recurringDto.maxInstances || 52; // Default to 1 year worth
    const endDate = recurringDto.recurrenceEndDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now

    let currentDate = new Date(parentEvent.startDate);
    let instanceCount = 0;

    while (instanceCount < maxInstances && currentDate <= endDate) {
      // Calculate next occurrence
      currentDate = this.getNextOccurrence(currentDate, recurringDto.recurrencePattern, recurringDto.recurrenceInterval);
      
      if (currentDate > endDate) break;

      // Calculate duration
      const duration = parentEvent.endDate.getTime() - parentEvent.startDate.getTime();
      const instanceEndDate = new Date(currentDate.getTime() + duration);

      // Create instance
      const instance = this.eventRepository.create({
        title: parentEvent.title,
        description: parentEvent.description,
        slug: `${parentEvent.slug}-${currentDate.toISOString().split('T')[0]}`,
        startDate: new Date(currentDate),
        endDate: instanceEndDate,
        locationType: parentEvent.locationType,
        venueName: parentEvent.venueName,
        venueAddress: parentEvent.venueAddress,
        latitude: parentEvent.latitude,
        longitude: parentEvent.longitude,
        virtualLink: parentEvent.virtualLink,
        meetingId: parentEvent.meetingId,
        meetingPassword: parentEvent.meetingPassword,
        type: parentEvent.type,
        visibility: parentEvent.visibility,
        status: parentEvent.status,
        capacity: parentEvent.capacity,
        requireApproval: parentEvent.requireApproval,
        allowWaitlist: parentEvent.allowWaitlist,
        tags: parentEvent.tags,
        categories: parentEvent.categories,
        targetAudience: parentEvent.targetAudience,
        experienceLevel: parentEvent.experienceLevel,
        industry: parentEvent.industry,
        creatorId: parentEvent.creatorId,
        parentEventId: parentEvent.id,
        isRecurring: false, // Instances are not recurring themselves
        recurrencePattern: null,
        recurrenceInterval: null,
        recurrenceEndDate: null,
        // Reset counters for new instance
        viewCount: 0,
        likeCount: 0,
        bookmarkCount: 0,
        engagementScore: 0
      });

      instances.push(instance);
      instanceCount++;
    }

    return instances;
  }

  private getNextOccurrence(currentDate: Date, pattern: string, interval: number): Date {
    const nextDate = new Date(currentDate);

    switch (pattern) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + interval);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + (7 * interval));
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + interval);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + interval);
        break;
    }

    return nextDate;
  }
}
